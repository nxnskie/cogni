/** One topic block inside generated study notes. */
export interface StudyNoteTopic {
  title: string;
  summary: string;
  bulletPoints: string[];
}

export type FlashcardStatus = "needs_review" | "mastered";

/** Single Q/A flashcard. */
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tag: string;
  status?: FlashcardStatus;
}

export type QuizType =
  | "multiple-choice"
  | "true-false"
  | "identification"
  | "fill-blank";

/** Mixed quiz item supporting MCQ, T/F, identification, and fill-in-the-blank. */
export interface QuizQuestion {
  id?: string;
  type: QuizType;
  question: string;
  /** Used for multiple-choice (4 options) and true-false (["True","False"]). */
  options: string[];
  correctAnswer: string;
  explanation: string;
  userAnswer?: string | null;
  isCorrect?: boolean | null;
}

/** Full structured payload returned by Gemini. */
export interface ReviewerPayload {
  studyNotes: StudyNoteTopic[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export type QuizDifficulty = "easy" | "medium" | "hard";
export type ReviewerFocus =
  | "conceptual"
  | "formulas"
  | "definitions"
  | "balanced";

export interface GenerationSettings {
  flashcardCount: number;
  quizCount: number;
  difficulty: QuizDifficulty;
  focus: ReviewerFocus;
}

export const DEFAULT_GENERATION_SETTINGS: GenerationSettings = {
  flashcardCount: 20,
  quizCount: 15,
  difficulty: "medium",
  focus: "balanced",
};

export const MAX_FLASHCARDS = 100;
export const MAX_QUIZ_QUESTIONS = 100;
export const MIN_FLASHCARDS = 5;
export const MIN_QUIZ_QUESTIONS = 5;

/** Request body for POST /api/generate-reviewer. */
export interface GenerateReviewerRequest {
  markdown: string;
  fileName?: string;
  title?: string;
  settings?: Partial<GenerationSettings>;
}

export interface ReviewerListItem {
  id: string;
  title: string;
  fileName: string | null;
  summary: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface SavedReviewer {
  id: string;
  title: string;
  fileName: string | null;
  summary: string | null;
  studyNotes: StudyNoteTopic[];
  focus: string;
  difficulty: string;
  flashcardCnt: number;
  quizCnt: number;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

/** Response from POST /api/upload after Python parsing. */
export interface UploadParseResponse {
  fileName: string;
  markdown: string;
}
