import { localDb } from './localDb';
import { apiClient, isDemoMode } from './apiClient';
// The legacy name keeps all existing screens connected through one adapter.
// Demo data is available only when explicitly enabled at build time.
export const supabase: typeof localDb = (isDemoMode ? localDb : apiClient) as typeof localDb;
