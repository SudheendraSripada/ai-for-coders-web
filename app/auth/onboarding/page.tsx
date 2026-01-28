'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, Rocket } from 'lucide-react'
import { OnboardingFormData, ExperienceLevel } from '@/lib/types'

export default function OnboardingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<OnboardingFormData>({
    experience_level: 'beginner',
    learning_goals: ''
  })
  const [loading, setLoading] = useState(false)

  const experienceOptions: { value: ExperienceLevel; label: string; description: string }[] = [
    {
      value: 'beginner',
      label: 'Beginner',
      description: 'Just starting out, learning the basics'
    },
    {
      value: 'intermediate',
      label: 'Intermediate',
      description: 'Comfortable with fundamentals, looking to grow'
    },
    {
      value: 'advanced',
      label: 'Advanced',
      description: 'Experienced, want to deepen expertise'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to save preferences')
      }

      router.push('/dashboard')
    } catch (err) {
      console.error('Error saving preferences:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <Rocket className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Let&apos;s get started!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Tell us a bit about yourself so we can personalize your learning experience
          </p>
        </div>

        <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-4">
              What&apos;s your experience level?
            </label>
            <div className="space-y-3">
              {experienceOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex cursor-pointer rounded-lg border p-4 transition-all ${
                    formData.experience_level === option.value
                      ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="experience_level"
                    value={option.value}
                    checked={formData.experience_level === option.value}
                    onChange={(e) =>
                      setFormData({ ...formData, experience_level: e.target.value as ExperienceLevel })
                    }
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.experience_level === option.value}
                        onChange={(e) =>
                          setFormData({ ...formData, experience_level: e.target.value as ExperienceLevel })
                        }
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-sm font-semibold text-gray-900">{option.label}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 ml-7">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="learning-goals" className="block text-sm font-medium text-gray-900">
              What are you learning? <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="learning-goals"
              name="learning-goals"
              type="text"
              placeholder="e.g., Python basics, Data structures, Web development"
              value={formData.learning_goals}
              onChange={(e) => setFormData({ ...formData, learning_goals: e.target.value })}
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center space-x-2 rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Brain className="h-5 w-5" />
              <span>{loading ? 'Setting up...' : 'Get Started'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
