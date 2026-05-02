'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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

interface Skill {
  id: string
  name: string
  category: string | null
  proficiency: number
  order_num: number
}

interface SkillForm {
  name: string
  category: string
  proficiency: number
}

const emptySkillForm: SkillForm = {
  name: '',
  category: '',
  proficiency: 5,
}

export default function ManageAbout() {
  const [aboutData, setAboutData] = useState<AboutRecord | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showSkillForm, setShowSkillForm] = useState(false)
  const [skillForm, setSkillForm] = useState<SkillForm>(emptySkillForm)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/admin')
        return
      }

      const [aboutResult, skillsResult] = await Promise.all([
        supabase.from('about').select('*').single(),
        supabase.from('skills').select('*').order('order_num', { ascending: true }),
      ])

      if (cancelled) {
        return
      }

      setAboutData((aboutResult.data as AboutRecord | null) ?? null)
      setSkills((skillsResult.data as Skill[] | null) ?? [])
      setLoading(false)
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [router])

  async function refreshSkills() {
    const { data } = await supabase.from('skills').select('*').order('order_num', { ascending: true })
    setSkills((data as Skill[] | null) ?? [])
  }

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

    if (!error) {
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
      setAboutData((current) => (current ? { ...current, profile_image_url: publicUrl } : current))
    }

    setUploading(false)
  }

  async function addSkill(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const { error } = await supabase.from('skills').insert([
      {
        ...skillForm,
        category: skillForm.category || null,
        order_num: skills.length + 1,
      },
    ])

    if (!error) {
      setShowSkillForm(false)
      setSkillForm(emptySkillForm)
      void refreshSkills()
    }
  }

  async function deleteSkill(id: string) {
    if (!confirm('Delete this skill?')) {
      return
    }

    const { error } = await supabase.from('skills').delete().eq('id', id)

    if (!error) {
      void refreshSkills()
    }
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!aboutData) {
    return <div className="flex min-h-screen items-center justify-center">About record not found.</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-2xl font-bold">Manage About &amp; Skills</h1>
          <button type="button" onClick={() => router.push('/admin/dashboard')} className="text-blue-600 hover:underline">
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl space-y-6 p-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Personal Information</h2>

          <form onSubmit={handleAboutUpdate} className="space-y-4">
            <div>
              <label htmlFor="profile-photo" className="mb-2 block text-gray-700">
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
              <label htmlFor="about-name" className="mb-2 block text-gray-700">
                Name *
              </label>
              <input
                id="about-name"
                type="text"
                value={aboutData.name}
                onChange={(event) => setAboutData((current) => (current ? { ...current, name: event.target.value } : current))}
                className="w-full rounded-lg border px-4 py-2"
                required
              />
            </div>

            <div>
              <label htmlFor="about-tagline" className="mb-2 block text-gray-700">
                Tagline
              </label>
              <input
                id="about-tagline"
                type="text"
                value={aboutData.tagline ?? ''}
                onChange={(event) => setAboutData((current) => (current ? { ...current, tagline: event.target.value } : current))}
                className="w-full rounded-lg border px-4 py-2"
                placeholder="Full Stack Developer | Building Amazing Web Experiences"
              />
            </div>

            <div>
              <label htmlFor="about-bio" className="mb-2 block text-gray-700">
                Bio
              </label>
              <textarea
                id="about-bio"
                value={aboutData.bio ?? ''}
                onChange={(event) => setAboutData((current) => (current ? { ...current, bio: event.target.value } : current))}
                className="w-full rounded-lg border px-4 py-2"
                rows={5}
                placeholder="Tell your story..."
              />
            </div>

            <div>
              <label htmlFor="about-email" className="mb-2 block text-gray-700">
                Email
              </label>
              <input
                id="about-email"
                type="email"
                value={aboutData.email ?? ''}
                onChange={(event) => setAboutData((current) => (current ? { ...current, email: event.target.value } : current))}
                className="w-full rounded-lg border px-4 py-2"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="about-github" className="mb-2 block text-gray-700">
                  GitHub URL
                </label>
                <input
                  id="about-github"
                  type="url"
                  value={aboutData.github_url ?? ''}
                  onChange={(event) => setAboutData((current) => (current ? { ...current, github_url: event.target.value } : current))}
                  className="w-full rounded-lg border px-4 py-2"
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div>
                <label htmlFor="about-linkedin" className="mb-2 block text-gray-700">
                  LinkedIn URL
                </label>
                <input
                  id="about-linkedin"
                  type="url"
                  value={aboutData.linkedin_url ?? ''}
                  onChange={(event) => setAboutData((current) => (current ? { ...current, linkedin_url: event.target.value } : current))}
                  className="w-full rounded-lg border px-4 py-2"
                  placeholder="https://linkedin.com/in/you"
                />
              </div>

              <div>
                <label htmlFor="about-twitter" className="mb-2 block text-gray-700">
                  Twitter URL
                </label>
                <input
                  id="about-twitter"
                  type="url"
                  value={aboutData.twitter_url ?? ''}
                  onChange={(event) => setAboutData((current) => (current ? { ...current, twitter_url: event.target.value } : current))}
                  className="w-full rounded-lg border px-4 py-2"
                  placeholder="https://twitter.com/you"
                />
              </div>
            </div>

            <button type="submit" className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700">
              Save Changes
            </button>
          </form>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Skills</h2>
            <button
              type="button"
              onClick={() => setShowSkillForm((current) => !current)}
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              {showSkillForm ? 'Cancel' : '+ Add Skill'}
            </button>
          </div>

          {showSkillForm ? (
            <form onSubmit={addSkill} className="mb-6 rounded-lg border bg-gray-50 p-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label htmlFor="skill-name" className="mb-2 block text-sm text-gray-700">
                    Skill Name *
                  </label>
                  <input
                    id="skill-name"
                    type="text"
                    value={skillForm.name}
                    onChange={(event) => setSkillForm((current) => ({ ...current, name: event.target.value }))}
                    className="w-full rounded border px-3 py-2"
                    placeholder="React"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="skill-category" className="mb-2 block text-sm text-gray-700">
                    Category
                  </label>
                  <input
                    id="skill-category"
                    type="text"
                    value={skillForm.category}
                    onChange={(event) => setSkillForm((current) => ({ ...current, category: event.target.value }))}
                    className="w-full rounded border px-3 py-2"
                    placeholder="Frontend"
                  />
                </div>
                <div>
                  <label htmlFor="skill-proficiency" className="mb-2 block text-sm text-gray-700">
                    Proficiency (1-10)
                  </label>
                  <input
                    id="skill-proficiency"
                    type="number"
                    min="1"
                    max="10"
                    value={skillForm.proficiency}
                    onChange={(event) => setSkillForm((current) => ({ ...current, proficiency: Number(event.target.value) }))}
                    className="w-full rounded border px-3 py-2"
                  />
                </div>
              </div>
              <button type="submit" className="mt-3 rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
                Add Skill
              </button>
            </form>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between rounded border p-3">
                <div>
                  <p className="font-medium">{skill.name}</p>
                  {skill.category ? <p className="text-xs text-gray-500">{skill.category}</p> : null}
                  <p className="text-xs text-gray-400">Level: {skill.proficiency}/10</p>
                </div>
                <button type="button" onClick={() => deleteSkill(skill.id)} className="text-sm text-red-600 hover:text-red-700">
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
