export const STRIDEBOARD_URL = "https://strideboard-rose.vercel.app/";

export const GOAL_CATEGORIES = [
  "Personal Best",
  "Sub-60 Attempt",
  "First Ever Race",
  "Just Finish Strong",
  "Injury Comeback",
] as const;

export const FILTER_LABELS = [
  "All Goals",
  "PB",
  "Sub-60",
  "First Race",
  "Finish",
  "Comeback",
] as const;

export function uniqueRunId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function uniqueGoalText(prefix: string): string {
  return `${prefix} ${uniqueRunId()}`;
}
