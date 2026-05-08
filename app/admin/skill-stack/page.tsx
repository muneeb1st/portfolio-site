'use client'

import { useEffect, useState } from 'react'
import { getSchemaSetupMessage, isMissingTableError } from '@/lib/admin-schema'
import { supabase } from '@/lib/supabase'
import { triggerRevalidation } from '@/lib/revalidate'

interface SkillCategory {
  id: string
  title: string
  skills: string[]
  order_num: number
}

export default function SkillStackPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [schemaMessage, setSchemaMessage] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    skills: '', // Comma separated
    order_num: 1,
  })

  async function fetchCategories() {
    const { data, error } = await supabase.from('skill_categories').select('*').order('order_num', { ascending: true })
    if (isMissingTableError(error)) {
      setSchemaMessage(getSchemaSetupMessage('Skill Categories'))
      setCategories([])
      setLoading(false)
      return
    }
    const nextCategories = (data as SkillCategory[] | null) ?? []
    setCategories(nextCategories)
    setFormData((current) => ({
      ...current,
      order_num: nextCategories.length + 1,
    }))
    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchCategories()
  }, [])

  function editCategory(category: SkillCategory) {
    setEditingId(category.id)
    setFormData({
      title: category.title,
      skills: category.skills.join(', '),
      order_num: category.order_num,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setFormData({ title: '', skills: '', order_num: categories.length + 1 })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (schemaMessage) {
      return
    }

    // Convert comma-separated string to array
    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    if (editingId) {
      const { error } = await supabase.from('skill_categories').update({
        title: formData.title,
        skills: skillsArray,
        order_num: formData.order_num,
      }).eq('id', editingId)
      if (!error) {
        cancelEdit()
        void fetchCategories()
        await triggerRevalidation()
      } else {
        console.error('Error updating category:', error)
        alert('Failed to update category. Check console for details.')
      }
      return
    }

    const { error } = await supabase.from('skill_categories').insert([
      {
        title: formData.title,
        skills: skillsArray,
        order_num: formData.order_num,
      },
    ])

    if (!error) {
      setFormData({ title: '', skills: '', order_num: categories.length + 2 })
      void fetchCategories()
      await triggerRevalidation()
    } else {
      console.error('Error adding category:', error)
      alert('Failed to add category. Check console for details.')
    }
  }

  async function deleteCategory(id: string) {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return
    }

    const { error } = await supabase.from('skill_categories').delete().eq('id', id)
    if (!error) {
      void fetchCategories()
      await triggerRevalidation()
      if (editingId === id) {
        cancelEdit()
      }
    } else {
      console.error('Error deleting category:', error)
      alert('Failed to delete category.')
    }
  }

  if (loading) {
    return <div className="text-gray-600">Loading skill stack...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Skill Stack</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage the categorized skills shown in the &apos;Skill stack&apos; section of the homepage.
        </p>
      </div>

      {schemaMessage && (
        <div className="mb-8 rounded-lg bg-blue-50 p-6 text-blue-800">
          <h2 className="mb-2 font-semibold">Schema Setup Required</h2>
          <pre className="whitespace-pre-wrap text-sm">{schemaMessage}</pre>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">{editingId ? 'Edit Category' : 'Add Category'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Category Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                placeholder="e.g. Frontend"
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                Skills (comma-separated)
              </label>
              <textarea
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
                placeholder="e.g. React, Next.js, TypeScript, Tailwind CSS"
              />
            </div>

            <div>
              <label htmlFor="order_num" className="block text-sm font-medium text-gray-700">
                Order
              </label>
              <input
                type="number"
                id="order_num"
                value={formData.order_num}
                onChange={(e) => setFormData({ ...formData, order_num: Number(e.target.value) })}
                className="mt-1 block w-32 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                min="1"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={Boolean(schemaMessage)}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {editingId ? 'Update Category' : 'Add Category'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-lg bg-gray-500 px-6 py-2 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Current Categories</h2>
          <div className="space-y-4">
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500">No categories found.</p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                  <div className="mb-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-medium text-gray-400">#{category.order_num}</span>
                      <h3 className="font-bold text-gray-900">{category.title}</h3>
                    </div>
                    <div className="flex gap-3 mt-2 sm:mt-0">
                      <button
                        type="button"
                        onClick={() => editCategory(category)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCategory(category.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, i) => (
                      <span key={i} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
