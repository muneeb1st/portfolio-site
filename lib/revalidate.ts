/**
 * Triggers on-demand revalidation of the home page.
 * Call this after any successful update in the admin panel.
 */
export async function triggerRevalidation() {
  try {
    const res = await fetch('/api/revalidate', {
      method: 'POST',
    })
    if (!res.ok) {
      console.error('Failed to revalidate path')
    }
    return await res.json()
  } catch (error) {
    console.error('Error triggering revalidation:', error)
  }
}
