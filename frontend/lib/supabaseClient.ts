// The app now runs on a local, in-browser database instead of Supabase, so it
// keeps working without a hosted backend. `localDb` implements the parts of the
// Supabase client the app uses, so every existing import keeps working.
//
// To go back to Supabase later, create the client here again with
// `createClient(url, anonKey)` from "@supabase/supabase-js".
import { localDb } from "./localDb";

export const supabase = localDb;
