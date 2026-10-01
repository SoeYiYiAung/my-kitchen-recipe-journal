import type { CommentEntry } from '../types';

const storageKey = 'happy-yum-diary-comments-v1';
type CommentsByRecipe = Record<string, CommentEntry[]>;

function readStoredComments(): CommentsByRecipe {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) as CommentsByRecipe : {};
  } catch {
    return {};
  }
}

export function getComments(): CommentsByRecipe {
  return readStoredComments();
}

export function saveComments(comments: CommentsByRecipe): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(comments));
  } catch {
    // The app still works for this session if browser storage is unavailable.
  }
}