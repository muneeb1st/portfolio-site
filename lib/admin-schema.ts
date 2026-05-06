interface SupabaseErrorLike {
  code?: string | null
  message?: string | null
}

export function isMissingTableError(error: SupabaseErrorLike | null | undefined) {
  return error?.code === 'PGRST205'
}

export function getSchemaSetupMessage(section: string) {
  return `${section} is ready in code, but its Supabase table is not installed yet. Run the 20260506 premium CMS migration in Supabase to enable secure saving.`
}
