"use client";

import { create } from "zustand";
import type {
  GenerationSettings,
  ReviewerListItem,
  ReviewerPayload,
  SavedReviewer,
} from "./types";
import { DEFAULT_GENERATION_SETTINGS } from "./types";

type ActiveTab = "notes" | "flashcards" | "quiz";

interface ReviewerStore {
  payload: ReviewerPayload | null;
  reviewerId: string | null;
  fileName: string | null;
  title: string | null;
  activeTab: ActiveTab;
  isGenerating: boolean;
  error: string | null;
  settings: GenerationSettings;
  history: ReviewerListItem[];
  setPayload: (
    payload: ReviewerPayload,
    meta?: { fileName?: string; reviewerId?: string | null; title?: string }
  ) => void;
  loadSaved: (saved: SavedReviewer) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setGenerating: (value: boolean) => void;
  setError: (message: string | null) => void;
  setSettings: (partial: Partial<GenerationSettings>) => void;
  setHistory: (items: ReviewerListItem[]) => void;
  removeHistoryItem: (id: string) => void;
  updateFlashcardLocal: (
    id: string,
    patch: Partial<ReviewerPayload["flashcards"][number]>
  ) => void;
  updateQuizLocal: (
    id: string,
    patch: Partial<ReviewerPayload["quiz"][number]>
  ) => void;
  clear: () => void;
}

export const useReviewerStore = create<ReviewerStore>((set) => ({
  payload: null,
  reviewerId: null,
  fileName: null,
  title: null,
  activeTab: "notes",
  isGenerating: false,
  error: null,
  settings: DEFAULT_GENERATION_SETTINGS,
  history: [],
  setPayload: (payload, meta) =>
    set({
      payload,
      fileName: meta?.fileName ?? null,
      reviewerId: meta?.reviewerId ?? null,
      title: meta?.title ?? meta?.fileName ?? null,
      activeTab: "notes",
      error: null,
      isGenerating: false,
    }),
  loadSaved: (saved) =>
    set({
      payload: {
        studyNotes: saved.studyNotes,
        flashcards: saved.flashcards,
        quiz: saved.quiz,
      },
      reviewerId: saved.id,
      fileName: saved.fileName,
      title: saved.title,
      activeTab: "notes",
      error: null,
      isGenerating: false,
    }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error, isGenerating: false }),
  setSettings: (partial) =>
    set((s) => ({ settings: { ...s.settings, ...partial } })),
  setHistory: (history) => set({ history }),
  removeHistoryItem: (id) =>
    set((s) => ({
      history: s.history.filter((h) => h.id !== id),
      ...(s.reviewerId === id
        ? {
            payload: null,
            reviewerId: null,
            fileName: null,
            title: null,
          }
        : {}),
    })),
  updateFlashcardLocal: (id, patch) =>
    set((s) => {
      if (!s.payload) return s;
      return {
        payload: {
          ...s.payload,
          flashcards: s.payload.flashcards.map((c) =>
            c.id === id ? { ...c, ...patch } : c
          ),
        },
      };
    }),
  updateQuizLocal: (id, patch) =>
    set((s) => {
      if (!s.payload) return s;
      return {
        payload: {
          ...s.payload,
          quiz: s.payload.quiz.map((q) =>
            (q.id ?? "") === id ? { ...q, ...patch } : q
          ),
        },
      };
    }),
  clear: () =>
    set({
      payload: null,
      reviewerId: null,
      fileName: null,
      title: null,
      activeTab: "notes",
      error: null,
      isGenerating: false,
    }),
}));
