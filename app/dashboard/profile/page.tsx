'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { UserProfile, ExperienceLevel } from '@/lib/types'
import { Brain, Code2, User, ArrowLeft, Mail, Edit2, Save, X, Camera } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    full_name: '',
    experience_level: 'beginner' as ExperienceLevel,
    learning_goals: '',
    preferred_language: 'python',
    bio: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/user')
        const data = await response.json()
        
        if (data.user) {
          setUser(data.user)
          setEditData({
            full_name: data.user.full_name || '',
            experience_level: data.user.experience_level || 'beginner',
            learning_goals: data.user.learning_goals || '',
            preferred_language: data.user.preferred_language || 'python',
            bio: data.user.bio || ''
          })
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })

      if (response.ok) {
        setUser({ ...user!, ...editData })
        setEditing(false)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setEditData({
        full_name: user.full_name || '',
        experience_level: user.experience_level || 'beginner',
        learning_goals: user.learning_goals || '',
        preferred_language: user.preferred_language || 'python',
        bio: user.bio || ''
      })
    }
    setEditing(false)
  }

  const experienceOptions = [
    { value: 'beginner', label: 'Beginner', description: 'Just starting out' },
    { value: 'intermediate', label: 'Intermediate', description: 'Comfortable with basics' },
    { value: 'advanced', label: 'Advanced', description: 'Looking to deepen expertise' }
  ]

  const languageOptions = [
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'c', label: 'C' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <Code2 className="h-8 w-8 text-indigo-600" />
                <Brain className="h-8 w-8 text-purple-600" />
                <span className="text-xl font-bold text-gray-900">AI for Coders</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-1 text-gray-600">
            Manage your account and preferences
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse rounded-xl bg-white p-8 shadow-sm">
            <div className="h-32 w-32 rounded-full bg-gray-200 mx-auto" />
            <div className="mt-4 h-6 w-48 bg-gray-200 rounded mx-auto" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              </div>
              <div className="p-6">
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {(user?.full_name || user?.email || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                    {editing && (
                      <button className="absolute bottom-0 right-0 rounded-full bg-gray-900 p-2 text-white hover:bg-gray-800">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    {editing ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          type="text"
                          value={editData.full_name}
                          onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-900">{user?.full_name || 'Not set'}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <div className="flex items-center mt-1">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="font-medium text-gray-900">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Learning Preferences</h2>
                {editing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-1 rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center space-x-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{saving ? 'Saving...' : 'Save'}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center space-x-1 rounded-md px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  {editing ? (
                    <div className="grid gap-3 md:grid-cols-3">
                      {experienceOptions.map((option) => (
                        <label
                          key={option.value}
                          className={`relative flex cursor-pointer rounded-lg border p-4 transition-all ${
                            editData.experience_level === option.value
                              ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="experience_level"
                            value={option.value}
                            checked={editData.experience_level === option.value}
                            onChange={(e) => setEditData({ 
                              ...editData, 
                              experience_level: e.target.value as ExperienceLevel 
                            })}
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{option.label}</p>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 capitalize">
                      {user?.experience_level || 'Beginner'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
                  {editing ? (
                    <div className="grid gap-3 md:grid-cols-3">
                      {languageOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setEditData({ ...editData, preferred_language: option.value })}
                          className={`rounded-lg border p-4 text-center transition-all ${
                            editData.preferred_language === option.value
                              ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <span className="font-medium text-gray-900">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 capitalize">
                      {user?.preferred_language || 'Python'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Learning Goals</label>
                  {editing ? (
                    <textarea
                      value={editData.learning_goals}
                      onChange={(e) => setEditData({ ...editData, learning_goals: e.target.value })}
                      rows={3}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="What do you want to learn?"
                    />
                  ) : (
                    <p className="text-gray-900">{user?.learning_goals || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  {editing ? (
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      rows={3}
                      className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-900">{user?.bio || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member since</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.created_at 
                      ? new Date(user.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })
                      : 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last updated</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.updated_at 
                      ? new Date(user.updated_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
