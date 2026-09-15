"use client";

import { useMemo, useState } from "react";
import type { QuizQuestion } from "@/lib/types";
import { useReviewerStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface QuizEngineProps {
  questions: QuizQuestion[];
  className?: string;
}

type AnswerMap = Record<number, string>;

function answersMatch(expected: string, given: string): boolean {
  const normalize = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ");
  return normalize(expected) === normalize(given);
}

function typeLabel(type: QuizQuestion["type"]): string {
  switch (type) {
    case "true-false":
      return "True / False";
    case "identification":
      return "Identification";
    case "fill-blank":
      return "Fill in the blank";
    default:
      return "Multiple choice";
  }
}

export function QuizEngine({ questions, className }: QuizEngineProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [finished, setFinished] = useState(false);
  const reviewerId = useReviewerStore((s) => s.reviewerId);
  const updateQuizLocal = useReviewerStore((s) => s.updateQuizLocal);
  const appendQuiz = useReviewerStore((s) => s.appendQuiz);
  const [targetCount, setTargetCount] = useState(questions.length);
  const [expanding, setExpanding] = useState(false);

  const total = questions.length;
  const current = total > 0 ? questions[index] : null;

  async function expandQuiz() {
    if (!reviewerId || targetCount <= total || expanding) return;
    setExpanding(true);
    try {
      const response = await fetch(`/api/reviewer/${reviewerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetCount }),
      });
      const data = (await response.json()) as { quiz?: QuizQuestion[]; error?: string };
      if (!response.ok || !data.quiz) throw new Error(data.error || "Quiz expansion failed");
      appendQuiz(data.quiz.slice(total));
    } catch (error) {
      console.error("[quiz] expansion failed", error);
    } finally {
      setExpanding(false);
    }
  }

  const score = useMemo(() => {
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      const given = answers[i];
      if (given && answersMatch(questions[i].correctAnswer, given)) correct += 1;
    }
    return {
      correct,
      percent: total === 0 ? 0 : Math.round((correct / total) * 100),
    };
  }, [answers, questions, total]);

  if (!current || total === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed border-sf-border p-8 text-center text-sm text-sf-muted",
          className
        )}
      >
        No quiz questions available.
      </div>
    );
  }

  if (finished) {
    return (
      <div
        className={cn(
          "mx-auto flex w-full max-w-xl flex-col items-center gap-4 rounded-2xl border border-sf-border bg-sf-card p-10 text-center",
          className
        )}
      >
        <p className="text-xs uppercase tracking-[0.2em] text-sf-gold">
          Quiz complete
        </p>
        <p className="text-5xl font-bold tabular-nums text-sf-accent">
          {score.percent}%
        </p>
        <p className="text-sm text-sf-muted">
          {score.correct} of {total} correct
        </p>
        <Button
          type="button"
          onClick={() => {
            setIndex(0);
            setSelected(null);
            setTextAnswer("");
            setSubmitted(false);
            setAnswers({});
            setFinished(false);
          }}
        >
          Retake quiz
        </Button>
      </div>
    );
  }

  const isChoice =
    current.type === "multiple-choice" || current.type === "true-false";
  const givenAnswer = isChoice ? selected : textAnswer;
  const isCorrect = Boolean(
    givenAnswer && answersMatch(current.correctAnswer, givenAnswer)
  );
  const canSubmit = isChoice ? Boolean(selected) : textAnswer.trim().length > 0;

  async function handleSubmit() {
    if (!current || !givenAnswer?.trim()) return;
    const answer = givenAnswer.trim();
    setSubmitted(true);
    setAnswers((prev) => ({ ...prev, [index]: answer }));
    const correct = answersMatch(current.correctAnswer, answer);
    if (current.id) {
      updateQuizLocal(current.id, {
        userAnswer: answer,
        isCorrect: correct,
      });
      if (reviewerId) {
        await fetch(`/api/reviewer/${reviewerId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz: [
              {
                id: current.id,
                userAnswer: answer,
                isCorrect: correct,
              },
            ],
          }),
        });
      }
    }
  }

  function handleNext() {
    if (index >= total - 1) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setTextAnswer("");
    setSubmitted(false);
  }

  const choiceOptions =
    current.type === "true-false"
      ? ["True", "False"]
      : current.options.length > 0
        ? current.options
        : [];

  return (
    <div className={cn("mx-auto flex w-full max-w-xl flex-col gap-5", className)}>
      <div className="flex items-center justify-between text-sm text-sf-muted">
        <span>
          Question {index + 1} / {total}
        </span>
        <span>
          Score so far: {score.correct}/{Object.keys(answers).length || 0}
        </span>
      </div>

      {reviewerId && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-sf-border bg-sf-card/70 p-3 text-sm">
          <label htmlFor="quiz-target" className="text-sf-muted">
            Quiz size
          </label>
          <input
            id="quiz-target"
            type="number"
            min={total}
            max={100}
            value={targetCount}
            onChange={(event) => setTargetCount(Number(event.target.value))}
            className="w-20 rounded-lg border border-sf-border bg-sf-bg2 px-2 py-1 text-sf-text"
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={expanding || targetCount <= total || targetCount > 100}
            onClick={() => void expandQuiz()}
          >
            {expanding ? "Generating…" : "Add questions"}
          </Button>
        </div>
      )}

      <p className="w-fit rounded-lg bg-sf-accent/15 px-2.5 py-1 text-xs font-medium text-sf-accent">
        {typeLabel(current.type)}
      </p>

      {current.imageUrl && (
        <img
          src={current.imageUrl}
          alt="Illustration for this question"
          className="max-h-72 w-full rounded-xl border border-sf-border object-contain"
          loading="lazy"
        />
      )}

      <h3 className="text-xl font-semibold leading-snug text-sf-text">
        {current.question}
      </h3>

      {isChoice ? (
        <ul className="flex flex-col gap-2">
          {choiceOptions.map((option) => {
            const isSelected = selected === option;
            let optionClass =
              "border-sf-border bg-sf-card hover:bg-sf-card-hover text-sf-text";

            if (submitted) {
              if (answersMatch(current.correctAnswer, option)) {
                optionClass =
                  "border-sf-accent/70 bg-sf-accent/15 text-sf-accent";
              } else if (
                isSelected &&
                !answersMatch(current.correctAnswer, option)
              ) {
                optionClass = "border-sf-error/70 bg-sf-error/15 text-sf-error";
              } else {
                optionClass = "border-sf-border bg-sf-card opacity-50";
              }
            } else if (isSelected) {
              optionClass =
                "border-sf-accent bg-sf-accent/10 text-sf-text ring-1 ring-sf-accent/40";
            }

            return (
              <li key={option}>
                <button
                  type="button"
                  disabled={submitted}
                  onClick={() => setSelected(option)}
                  className={cn(
                    "w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors disabled:cursor-default",
                    optionClass
                  )}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={textAnswer}
            disabled={submitted}
            placeholder={
              current.type === "fill-blank"
                ? "Type the missing word or phrase"
                : "Type your answer"
            }
            onChange={(e) => setTextAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSubmit && !submitted) {
                void handleSubmit();
              }
            }}
            className="w-full rounded-xl border border-sf-border bg-sf-card px-4 py-3 text-sm text-sf-text outline-none focus:border-sf-accent disabled:opacity-70"
          />
        </div>
      )}

      {submitted && (
        <div
          className={cn(
            "rounded-xl border px-4 py-3 text-sm",
            isCorrect
              ? "border-sf-accent/50 bg-sf-accent/10 text-sf-accent"
              : "border-sf-error/50 bg-sf-error/10 text-sf-error"
          )}
        >
          <p className="font-semibold">
            {isCorrect ? "Correct" : "Incorrect"}
          </p>
          {!isCorrect && (
            <p className="mt-1 text-sf-text/90">
              Answer: {current.correctAnswer}
            </p>
          )}
          <p className="mt-1 leading-relaxed text-sf-text/90">
            {current.explanation}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {!submitted ? (
          <Button
            type="button"
            disabled={!canSubmit}
            onClick={() => void handleSubmit()}
          >
            Submit answer
          </Button>
        ) : (
          <Button type="button" onClick={handleNext}>
            {index >= total - 1 ? "See final score" : "Next question"}
          </Button>
        )}
      </div>
    </div>
  );
}
