/**
 * Shared authentication constants.
 * STORAGE_STATE_PATH is used by both the setup project and playwright.config.ts.
 * The file at this path is gitignored — it must never be committed.
 */
export const STORAGE_STATE_PATH = "playwright/.auth/user.json";
