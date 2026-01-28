'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CodeEditor from '@/components/CodeEditor'
import ProgressTracker from '@/components/ProgressTracker'
import { Lesson, Task, UserProgress } from '@/lib/types'
import { ArrowLeft, BookOpen, Play, CheckCircle, XCircle } from 'lucide-react'

interface LessonData extends Lesson {
  tasks: Task[]
}

export default function LessonPage() {
  const params = useParams()
  const languageSlug = params.language as string
  const courseSlug = params.course as string
  const lessonSlug = params.lesson as string
  
  const [lesson, setLesson] = useState<LessonData | null>(null)
  const [courseTitle, setCourseTitle] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [taskOutput, setTaskOutput] = useState('')
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState<UserProgress[]>([])

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const coursesResponse = await fetch(`/api/content/courses?language=${languageSlug}`)
        const coursesData = await coursesResponse.json()
        
        const course = coursesData.courses?.find((c: any) => c.slug === courseSlug)
        if (course) {
          setCourseTitle(course.title)
          
          const lessonsResponse = await fetch(`/api/content/lessons?course_id=${course.id}`)
          const lessonsData = await lessonsResponse.json()
          
          const foundLesson = lessonsData.lessons?.find((l: any) => l.slug === lessonSlug)
          if (foundLesson) {
            setLesson(foundLesson)
            if (foundLesson.tasks?.length > 0) {
              setSelectedTask(foundLesson.tasks[0])
            }
          }
        }

        const progressResponse = await fetch('/api/progress')
        const progressData = await progressResponse.json()
        if (progressData.progress) {
          setProgress(progressData.progress)
        }
      } catch (error) {
        console.error('Error fetching lesson:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [languageSlug, courseSlug, lessonSlug])

  const handleRunCode = (code: string) => {
    if (!selectedTask) return

    const userOutput = code.trim()
    const expectedOutput = selectedTask.expected_output?.trim() || ''

    setTaskOutput('Your code has been submitted for review.')

    if (userOutput === expectedOutput) {
      setIsCorrect(true)
      saveProgress(true, 100)
    } else {
      setIsCorrect(false)
      saveProgress(false, 0)
    }
  }

  const saveProgress = async (completed: boolean, score: number) => {
    if (!selectedTask) return

    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: lesson!.id,
          task_id: selectedTask.id,
          completed,
          score,
          code_solution: selectedTask.starter_code
        })
      })

      const progressResponse = await fetch('/api/progress')
      const progressData = await progressResponse.json()
      if (progressData.progress) {
        setProgress(progressData.progress)
      }
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  const getLanguageColor = (slug: string) => {
    switch (slug) {
      case 'python': return 'from-blue-500 to-blue-600'
      case 'java': return 'from-orange-500 to-orange-600'
      case 'c': return 'from-gray-500 to-gray-600'
      default: return 'from-indigo-500 to-indigo-600'
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Lesson not found</h1>
            <Link href={`/explore/${languageSlug}/${courseSlug}`} className="mt-4 text-indigo-600 hover:text-indigo-500">
              Back to Course
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const completedLessonIds = progress
    .filter(p => p.completed)
    .map(p => p.lesson_id)

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <div className={`bg-gradient-to-r ${getLanguageColor(languageSlug)} py-6`}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href={`/explore/${languageSlug}/${courseSlug}`}
              className="inline-flex items-center text-sm text-white/80 hover:text-white mb-2"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to {courseTitle}
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {lesson.title}
            </h1>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="lg:col-span-3 space-y-8">
              <div className="rounded-xl bg-white shadow-md">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-semibold text-gray-900">Lesson Content</h2>
                </div>
                <div className="p-6 prose prose-indigo max-w-none">
                  {lesson.content_html ? (
                    <div dangerouslySetInnerHTML={{ __html: lesson.content_html }} />
                  ) : (
                    <p className="text-gray-600">Lesson content coming soon...</p>
                  )}
                </div>
              </div>

              {lesson.code_example && (
                <div className="rounded-xl bg-white shadow-md">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">Code Example</h2>
                  </div>
                  <div className="p-4">
                    <CodeEditor
                      initialCode={lesson.code_example}
                      language={languageSlug}
                      readOnly
                    />
                  </div>
                </div>
              )}

              {selectedTask && (
                <div className="rounded-xl bg-white shadow-md">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">Practice Task</h2>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{selectedTask.title}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          selectedTask.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          selectedTask.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {selectedTask.difficulty || 'Easy'}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">{selectedTask.problem_statement}</p>
                    </div>

                    <div className="mt-4">
                      <CodeEditor
                        initialCode={selectedTask.starter_code || ''}
                        language={languageSlug}
                        onRun={handleRunCode}
                      />
                    </div>

                    {taskOutput && (
                      <div className={`mt-4 rounded-lg p-4 ${
                        isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}>
                        <div className="flex items-center">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mr-2" />
                          )}
                          <p className={isCorrect ? 'text-green-800' : 'text-red-800'}>
                            {isCorrect 
                              ? 'Correct! Great job!' 
                              : 'Not quite right. Try again!'}
                          </p>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{taskOutput}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {lesson.tasks && lesson.tasks.length > 1 && (
                <div className="rounded-xl bg-white shadow-md">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">All Tasks</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {lesson.tasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => {
                          setSelectedTask(task)
                          setTaskOutput('')
                          setIsCorrect(null)
                        }}
                        className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedTask?.id === task.id ? 'bg-indigo-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Play className={`h-5 w-5 ${
                              selectedTask?.id === task.id ? 'text-indigo-600' : 'text-gray-400'
                            }`} />
                            <span className="font-medium text-gray-900">{task.title}</span>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            task.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                            task.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {task.difficulty || 'Easy'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <ProgressTracker
                  lessons={lesson.tasks?.map((task, index) => ({
                    id: task.id,
                    title: task.title,
                    slug: task.slug,
                    order_index: index,
                    tasks: progress
                      .filter(p => p.task_id === task.id)
                      .map(p => ({ id: p.id, completed: p.completed }))
                  })) || []}
                  currentLessonId={selectedTask?.id}
                  completedLessonIds={progress.filter(p => p.completed).map(p => p.task_id)}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
