'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  demo_url: string | null
  github_url: string | null
  featured: boolean
  image_url: string | null
  order: number
}

interface ProjectForm {
  title: string
  description: string
  technologies: string
  demo_url: string
  github_url: string
  featured: boolean
  image_url: string
}

const emptyForm: ProjectForm = {
  title: '',
  description: '',
  technologies: '',
  demo_url: '',
  github_url: '',
  featured: false,
  image_url: '',
}

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<ProjectForm>(emptyForm)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    async function loadProjects() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/admin')
        return
      }

      const { data } = await supabase.from('projects').select('*').order('order', { ascending: true })

      if (cancelled) {
        return
      }

      const nextProjects =
        ((data as Array<Omit<Project, 'technologies'> & { technologies: unknown }> | null) ?? []).map((project) => ({
          ...project,
          technologies: toStringArray(project.technologies),
          featured: Boolean(project.featured),
          image_url: project.image_url ?? null,
          demo_url: project.demo_url ?? null,
          github_url: project.github_url ?? null,
        }))

      setProjects(nextProjects)
      setLoading(false)
    }

    void loadProjects()

    return () => {
      cancelled = true
    }
  }, [router])

  async function refreshProjects() {
    const { data } = await supabase.from('projects').select('*').order('order', { ascending: true })
    const nextProjects =
      ((data as Array<Omit<Project, 'technologies'> & { technologies: unknown }> | null) ?? []).map((project) => ({
        ...project,
        technologies: toStringArray(project.technologies),
        featured: Boolean(project.featured),
        image_url: project.image_url ?? null,
        demo_url: project.demo_url ?? null,
        github_url: project.github_url ?? null,
      }))
    setProjects(nextProjects)
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const filePath = `${crypto.randomUUID()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from('project-images').upload(filePath, file)

    if (uploadError) {
      alert('Error uploading image.')
      setUploading(false)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('project-images').getPublicUrl(filePath)

    setFormData((current) => ({ ...current, image_url: publicUrl }))
    setUploading(false)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const payload = {
      title: formData.title,
      description: formData.description,
      technologies: formData.technologies
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      demo_url: formData.demo_url || null,
      github_url: formData.github_url || null,
      featured: formData.featured,
      image_url: formData.image_url || null,
    }

    if (editingId) {
      const { error } = await supabase.from('projects').update(payload).eq('id', editingId)

      if (!error) {
        setShowForm(false)
        setEditingId(null)
        setFormData(emptyForm)
        void refreshProjects()
      }
      return
    }

    const { error } = await supabase.from('projects').insert([
      {
        ...payload,
        order: projects.length + 1,
      },
    ])

    if (!error) {
      setShowForm(false)
      setFormData(emptyForm)
      void refreshProjects()
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) {
      return
    }

    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (!error) {
      void refreshProjects()
    }
  }

  function editProject(project: Project) {
    setEditingId(project.id)
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      demo_url: project.demo_url ?? '',
      github_url: project.github_url ?? '',
      featured: project.featured,
      image_url: project.image_url ?? '',
    })
    setShowForm(true)
  }

  function cancelEdit() {
    setShowForm(false)
    setEditingId(null)
    setFormData(emptyForm)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white p-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-2xl font-bold">Manage Projects</h1>
          <button type="button" onClick={() => router.push('/admin/dashboard')} className="text-blue-600 hover:underline">
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl p-6">
        <button
          type="button"
          onClick={() => {
            if (showForm && !editingId) {
              setShowForm(false)
              return
            }

            cancelEdit()
            setShowForm(true)
          }}
          className="mb-6 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add New Project'}
        </button>

        {showForm ? (
          <div className="mb-6 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="project-image" className="mb-2 block text-gray-700">
                  Project Image
                </label>
                <input
                  id="project-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full rounded-lg border px-4 py-2"
                  disabled={uploading}
                />
                {uploading ? <p className="mt-2 text-sm text-blue-600">Uploading...</p> : null}
                {formData.image_url ? (
                  <div className="mt-3">
                    <Image
                      src={formData.image_url}
                      alt="Project preview"
                      width={192}
                      height={128}
                      className="h-32 w-48 rounded-lg border object-cover"
                    />
                  </div>
                ) : null}
              </div>

              <div className="mb-4">
                <label htmlFor="project-title" className="mb-2 block text-gray-700">
                  Title *
                </label>
                <input
                  id="project-title"
                  type="text"
                  value={formData.title}
                  onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-lg border px-4 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="project-description" className="mb-2 block text-gray-700">
                  Description *
                </label>
                <textarea
                  id="project-description"
                  value={formData.description}
                  onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                  className="w-full rounded-lg border px-4 py-2"
                  rows={3}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="project-technologies" className="mb-2 block text-gray-700">
                  Technologies (comma separated) *
                </label>
                <input
                  id="project-technologies"
                  type="text"
                  value={formData.technologies}
                  onChange={(event) => setFormData((current) => ({ ...current, technologies: event.target.value }))}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full rounded-lg border px-4 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="project-demo-url" className="mb-2 block text-gray-700">
                  Demo URL
                </label>
                <input
                  id="project-demo-url"
                  type="url"
                  value={formData.demo_url}
                  onChange={(event) => setFormData((current) => ({ ...current, demo_url: event.target.value }))}
                  className="w-full rounded-lg border px-4 py-2"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="project-github-url" className="mb-2 block text-gray-700">
                  GitHub URL
                </label>
                <input
                  id="project-github-url"
                  type="url"
                  value={formData.github_url}
                  onChange={(event) => setFormData((current) => ({ ...current, github_url: event.target.value }))}
                  className="w-full rounded-lg border px-4 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(event) => setFormData((current) => ({ ...current, featured: event.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Featured Project</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700">
                  {editingId ? 'Update Project' : 'Save Project'}
                </button>
                {editingId ? (
                  <button type="button" onClick={cancelEdit} className="rounded-lg bg-gray-500 px-6 py-2 text-white hover:bg-gray-600">
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        ) : null}

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Existing Projects ({projects.length})</h2>

          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading projects...</div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="flex gap-4 rounded-lg border p-4">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      width={96}
                      height={96}
                      className="h-24 w-24 rounded object-cover"
                    />
                  ) : null}

                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{project.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{project.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.technologies.map((technology) => (
                        <span key={technology} className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                          {technology}
                        </span>
                      ))}
                    </div>
                    {project.featured ? (
                      <span className="mt-2 inline-block rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">Featured</span>
                    ) : null}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editProject(project)}
                      className="h-fit rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProject(project.id)}
                      className="h-fit rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
