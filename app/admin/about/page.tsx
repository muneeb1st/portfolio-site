'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ManageAbout() {
  const [aboutData, setAboutData] = useState<any>(null)
  const [skills, setSkills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showSkillForm, setShowSkillForm] = useState(false)
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: '',
    proficiency: 5
  })
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/admin')
  }

  async function fetchData() {
    const { data: about } = await supabase
      .from('about')
      .select('*')
      .single()
    
    const { data: skillsData } = await supabase
      .from('skills')
      .select('*')
      .order('order_num', { ascending: true })
    
    setAboutData(about)
    setSkills(skillsData || [])
    setLoading(false)
  }

  async function handleAboutUpdate(e: React.FormEvent) {
    e.preventDefault()
    
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
        updated_at: new Date().toISOString()
      })
      .eq('id', aboutData.id)
    
    if (!error) {
      alert('Updated successfully!')
    }
  }

  async function handleProfileImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const fileName = `profile.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      alert('Error uploading image!')
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName)

    const { error } = await supabase
      .from('about')
      .update({ profile_image_url: publicUrl })
      .eq('id', aboutData.id)

    if (!error) {
      setAboutData({ ...aboutData, profile_image_url: publicUrl })
    }

    setUploading(false)
  }

  async function addSkill(e: React.FormEvent) {
    e.preventDefault()
    
    const { error } = await supabase
      .from('skills')
      .insert([{
        ...skillForm,
        order_num: skills.length + 1
      }])
    
    if (!error) {
      setShowSkillForm(false)
      setSkillForm({ name: '', category: '', proficiency: 5 })
      fetchData()
    }
  }

  async function deleteSkill(id: string) {
    if (!confirm('Delete this skill?')) return
    
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id)
    
    if (!error) fetchData()
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage About & Skills</h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* About Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Personal Information</h2>
          
          <form onSubmit={handleAboutUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="w-full px-4 py-2 border rounded-lg"
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
              {aboutData?.profile_image_url && (
                <img src={aboutData.profile_image_url} alt="Profile" className="w-32 h-32 object-cover rounded-full mt-3 border-4 border-purple-200" />
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={aboutData?.name || ''}
                onChange={(e) => setAboutData({...aboutData, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Tagline</label>
              <input
                type="text"
                value={aboutData?.tagline || ''}
                onChange={(e) => setAboutData({...aboutData, tagline: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Full Stack Developer | Building Amazing Web Experiences"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Bio</label>
              <textarea
                value={aboutData?.bio || ''}
                onChange={(e) => setAboutData({...aboutData, bio: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                rows={5}
                placeholder="Tell your story..."
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={aboutData?.email || ''}
                onChange={(e) => setAboutData({...aboutData, email: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={aboutData?.github_url || ''}
                  onChange={(e) => setAboutData({...aboutData, github_url: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={aboutData?.linkedin_url || ''}
                  onChange={(e) => setAboutData({...aboutData, linkedin_url: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="https://linkedin.com/in/you"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Twitter URL</label>
                <input
                  type="url"
                  value={aboutData?.twitter_url || ''}
                  onChange={(e) => setAboutData({...aboutData, twitter_url: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="https://twitter.com/you"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Skills Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Skills</h2>
            <button
              onClick={() => setShowSkillForm(!showSkillForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              {showSkillForm ? 'Cancel' : '+ Add Skill'}
            </button>
          </div>

          {showSkillForm && (
            <form onSubmit={addSkill} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm">Skill Name *</label>
                  <input
                    type="text"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="React"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 text-sm">Category</label>
                  <input
                    type="text"
                    value={skillForm.category}
                    onChange={(e) => setSkillForm({...skillForm, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Frontend"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 text-sm">Proficiency (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={skillForm.proficiency}
                    onChange={(e) => setSkillForm({...skillForm, proficiency: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <button type="submit" className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
                Add Skill
              </button>
            </form>
          )}

          <div className="grid md:grid-cols-2 gap-3">
            {skills.map(skill => (
              <div key={skill.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{skill.name}</p>
                  {skill.category && <p className="text-xs text-gray-500">{skill.category}</p>}
                  <p className="text-xs text-gray-400">Level: {skill.proficiency}/10</p>
                </div>
                <button
                  onClick={() => deleteSkill(skill.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
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
