import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

let supabaseClient: any = null;

export function createClient() {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );
  }
  return supabaseClient;
}

// Export a singleton instance for direct use
export const supabase = createClient();

export function getServerUrl(path: string) {
  return `https://${projectId}.supabase.co/functions/v1/make-server-638221b2${path}`;
}
