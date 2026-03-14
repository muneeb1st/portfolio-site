'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ManageCertificates() {
  const [certificates, setCertificates] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issue_date: '',
    credential_url: '',
  })
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchCertificates()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) router.push('/admin')
  }

  async function fetchCertificates() {
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .order('order', { ascending: true })
    setCertificates(data || [])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (editingId) {
      // Update existing certificate
      const { error } = await supabase
        .from('certificates')
        .update(formData)
        .eq('id', editingId)
      
      if (!error) {
        setShowForm(false)
        setEditingId(null)
        setFormData({ title: '', issuer: '', issue_date: '', credential_url: '' })
        fetchCertificates()
      }
    } else {
      // Create new certificate
      const { error } = await supabase.from('certificates').insert([{
        ...formData,
        order: certificates.length + 1
      }])

      if (!error) {
        setShowForm(false)
        setFormData({ title: '', issuer: '', issue_date: '', credential_url: '' })
        fetchCertificates()
      }
    }
  }

  async function deleteCertificate(id: string) {
    if (!confirm('Are you sure you want to delete this certificate?')) return
    
    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id)
    
    if (!error) {
      fetchCertificates()
    }
  }

  function editCertificate(cert: any) {
    setEditingId(cert.id)
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      issue_date: cert.issue_date,
      credential_url: cert.credential_url || '',
    })
    setShowForm(true)
  }

  function cancelEdit() {
    setShowForm(false)
    setEditingId(null)
    setFormData({ title: '', issuer: '', issue_date: '', credential_url: '' })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Certificates</h1>
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
          {showForm ? 'Cancel' : '+ Add New Certificate'}
        </button>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Certificate' : 'Add New Certificate'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Certificate Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="AWS Certified Developer"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Issuing Organization *</label>
                <input
                  type="text"
                  value={formData.issuer}
                  onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                  placeholder="Amazon Web Services"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Issue Date *</label>
                <input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({...formData, issue_date: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Credential URL</label>
                <input
                  type="url"
                  value={formData.credential_url}
                  onChange={(e) => setFormData({...formData, credential_url: e.target.value})}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  {editingId ? 'Update Certificate' : 'Save Certificate'}
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
          <h2 className="text-xl font-bold mb-4">Existing Certificates ({certificates.length})</h2>
          <div className="space-y-4">
            {certificates.map(cert => (
              <div key={cert.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{cert.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{cert.issuer}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(cert.issue_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => editCertificate(cert)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCertificate(cert.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}