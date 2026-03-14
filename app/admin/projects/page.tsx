'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ManageProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    demo_url: '',
    github_url: '',
    featured: false,
    image_url: '',
  })
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchProjects()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/admin')
  }

  async function fetchProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('order', { ascending: true })
    setProjects(data || [])
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError, data } = await supabase.storage
      .from('project-images')
      .upload(filePath, file)

    if (uploadError) {
      alert('Error uploading image!')
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath)

    setFormData({ ...formData, image_url: publicUrl })
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const techArray = formData.technologies.split(',').map(t => t.trim())
    
    if (editingId) {
      const { error } = await supabase
        .from('projects')
        .update({
          title: formData.title,
          description: formData.description,
          technologies: techArray,
          demo_url: formData.demo_url,
          github_url: formData.github_url,
          featured: formData.featured,
          image_url: formData.image_url,
        })
        .eq('id', editingId)
      
      if (!error) {
        setShowForm(false)
        setEditingId(null)
        setFormData({ title: '', description: '', technologies: '', demo_url: '', github_url: '', featured: false, image_url: '' })
        fetchProjects()
      }
    } else {
      const { error } = await supabase.from('projects').insert([{
        title: formData.title,
        description: formData.description,
        technologies: techArray,
        demo_url: formData.demo_url,
        github_url: formData.github_url,
        featured: formData.featured,
        image_url: formData.image_url,
        order: projects.length + 1
      }])

      if (!error) {
        setShowForm(false)
        setFormData({ title: '', description: '', technologies: '', demo_url: '', github_url: '', featured: false, image_url: '' })
        fetchProjects()
      }
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (!error) {
      fetchProjects()
    }
  }

  function editProject(project: any) {
    setEditingId(project.id)
    setFormData({
      title: project.title,
      description: project.description,
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      demo_url: project.demo_url || '',
      github_url: project.github_url || '',
      featured: project.featured,
      image_url: project.image_url || '',
    })
    setShowForm(true)
  }

  function cancelEdit() {
    setShowForm(false)
    setEditingId(null)
    setFormData({ title: '', description: '', technologies: '', demo_url: '', github_url: '', featured: false, image_url: '' })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Projects</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <button
          onClick={() => {
            if (showForm && !editingId) {
              setShowForm(false)
            } else {
              cancelEdit()
              setShowForm(true)
            }
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mb-6"
        >
          {showForm ? 'Cancel' : '+ Add New Project'}
        </button>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Project Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border rounded-lg"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
                {formData.image_url && (
                  <div className="mt-3">
                    <img src={formData.image_url} alt="Preview" className="w-48 h-32 object-cover rounded-lg border" />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Technologies (comma separated) *</label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Demo URL</label>
                <input
                  type="url"
                  value={formData.demo_url}
                  onChange={(e) => setFormData({...formData, demo_url: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({...formData, github_url: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-gray-700">Featured Project</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  {editingId ? 'Update Project' : 'Save Project'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Existing Projects ({projects.length})</h2>
          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id} className="border p-4 rounded-lg flex gap-4">
                {project.image_url && (
                  <img src={project.image_url} alt={project.title} className="w-24 h-24 object-cover rounded" />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{project.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Array.isArray(project.technologies) && project.technologies.map(tech => (
                      <span key={tech} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  {project.featured && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-2 inline-block">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editProject(project)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm h-fit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm h-fit"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}