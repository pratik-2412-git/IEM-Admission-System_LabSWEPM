import { createClient, SupabaseClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to upload document to Supabase storage with fallback
export async function uploadAdmissionDoc(
  file: File,
  applicationId: string,
  docType: string
): Promise<{ path: string; url?: string; error?: string }> {
  if (!supabase) {
    return { path: `local/${applicationId}/${docType}_${file.name}` };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${applicationId}/${docType}_${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('admission-docs')
      .upload(filePath, file, { upsert: true });

    if (error) {
      console.warn('Supabase storage upload error, falling back:', error);
      return { path: filePath, error: error.message };
    }

    const { data: urlData } = supabase.storage
      .from('admission-docs')
      .getPublicUrl(data.path);

    return { path: data.path, url: urlData?.publicUrl };
  } catch (err: any) {
    return { path: `local/${applicationId}/${file.name}`, error: err.message };
  }
}
