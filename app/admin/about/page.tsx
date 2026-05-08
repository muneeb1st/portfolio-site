'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { triggerRevalidation } from '@/lib/revalidate'

interface AboutRecord {
  id: string
  name: string
  tagline: string | null
  bio: string | null
  email: string | null
  github_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
  profile_image_url: string | null
}

export default function ManageAbout() {
  const [aboutData, setAboutData] = useState<AboutRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return
      }

      const { data, error } = await supabase.from('about').select('*').single()

      if (cancelled) {
        return
      }

      if (!error) {
        setAboutData((data as AboutRecord | null) ?? null)
      }
      setLoading(false)
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleAboutUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!aboutData) {
      return
    }

    const { error } = await supabase
      .from('about')
      .update({
        name: aboutData.name,
        tagline: aboutData.tagline,
        bio: aboutData.bio,
        email: aboutData.email,
        github_url: aboutData.github_url,
        linkedin_url: aboutData.linkedin_url,
        twitter_url: aboutData.twitter_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', aboutData.id)

    if (error) {
      alert('Error updating about information: ' + error.message)
    } else {
      await triggerRevalidation()
      alert('Updated successfully.')
    }
  }

  async function handleProfileImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file || !aboutData) {
      return
    }

    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const fileName = `profile.${fileExt}`

    const { error: uploadError } = await supabase.storage.from('profile-images').upload(fileName, file, { upsert: true })

    if (uploadError) {
      alert('Error uploading image.')
      setUploading(false)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('profile-images').getPublicUrl(fileName)

    const { error } = await supabase.from('about').update({ profile_image_url: publicUrl }).eq('id', aboutData.id)

    if (!error) {
      await triggerRevalidation()
      setAboutData((current) => (current ? { ...current, profile_image_url: publicUrl } : current))
    }

    setUploading(false)
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!aboutData) {
    return <div className="flex min-h-screen items-center justify-center">About record not found.</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">About Me</h1>
      <p className="text-sm text-slate-500 mb-6">Manage your personal information, profile photo, and social links.</p>

      <div className="space-y-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Personal Information</h2>

          <form onSubmit={handleAboutUpdate} className="space-y-4">
            <div>
              <label htmlFor="profile-photo" className="mb-2 block text-gray-900 font-medium">
                Profile Photo
              </label>
              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="w-full rounded-lg border px-4 py-2"
                disabled={uploading}
              />
              {uploading ? <p className="mt-2 text-sm text-blue-600">Uploading...</p> : null}
              {aboutData.profile_image_url ? (
                <Image
                  src={aboutData.profile_image_url}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="mt-3 h-32 w-32 rounded-full border-4 border-purple-200 object-cover"
                />
              ) : null}
            </div>

            <div>
              <label htmlFor="about-name" className="mb-2 block text-gray-900 font-medium">
                Name *
              </label>
              <input
                id="about-name"
                type="text"
                value={aboutData.name}
                onChange={(event) => setAboutData((current) => (current ? { ...current, name: event.target.value } : current))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="about-tagline" className="mb-2 block text-gray-900 font-medium">
                Tagline
              </label>
              <input
                id="about-tagline"
                type="text"
                value={aboutData.tagline ?? ''}
                onChange={(event) => setAboutData((current) => (current ? { ...current, tagline: event.target.value } : current))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Full Stack Developer | Building Amazing Web Experiences"
              />
            </div>

            <div>
              <label htmlFor="about-bio" className="mb-2 block text-gray-900 font-medium">
                Bio
              </label>
              <textarea
                id="about-bio"
                value={aboutData.bio ?? ''}
                onChange={(event) => setAboutData((current) => (current ? { ...current, bio: event.target.value } : current))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                rows={5}
                placeholder="Tell your story..."
              />
            </div>

            <div>
              <label htmlFor="about-email" className="mb-2 block text-gray-900 font-medium">
                Email
              </label>
              <input
                id="about-email"
                type="email"
                value={aboutData.email ?? ''}
                onChange={(event) => setAboutData((current) => (current ? { ...current, email: event.target.value } : current))}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="about-github" className="mb-2 block text-gray-900 font-medium">
                  GitHub URL
                </label>
                <input
                  id="about-github"
                  type="url"
                  value={aboutData.github_url ?? ''}
                  onChange={(event) => setAboutData((current) => (current ? { ...current, github_url: event.target.value } : current))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div>
                <label htmlFor="about-linkedin" className="mb-2 block text-gray-900 font-medium">
                  LinkedIn URL
                </label>
                <input
                  id="about-linkedin"
                  type="url"
                  value={aboutData.linkedin_url ?? ''}
                  onChange={(event) => setAboutData((current) => (current ? { ...current, linkedin_url: event.target.value } : current))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/you"
                />
              </div>

              <div>
                <label htmlFor="about-twitter" className="mb-2 block text-gray-900 font-medium">
                  Twitter URL
                </label>
                <input
                  id="about-twitter"
                  type="url"
                  value={aboutData.twitter_url ?? ''}
                  onChange={(event) => setAboutData((current) => (current ? { ...current, twitter_url: event.target.value } : current))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="https://twitter.com/you"
                />
              </div>
            </div>

            <button type="submit" className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
