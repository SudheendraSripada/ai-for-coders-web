import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MessageSquare, Bug, TrendingUp, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Learn to Think Like a Programmer
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
              Ask AI anything. Get guided explanations. Build real understanding.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href="/auth/signup"
                className="flex items-center space-x-2 rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-white hover:bg-indigo-700"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-8 shadow-sm">
                <div className="mb-4 inline-flex rounded-lg bg-indigo-100 p-3">
                  <MessageSquare className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Explain Concepts
                </h3>
                <p className="text-gray-600">
                  Ask questions. Get Socratic responses that guide you to understanding.
                </p>
              </div>

              <div className="rounded-lg bg-white p-8 shadow-sm">
                <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3">
                  <Bug className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Debug Your Thinking
                </h3>
                <p className="text-gray-600">
                  Learn why your code works (or doesn&apos;t), not just how to fix it.
                </p>
              </div>

              <div className="rounded-lg bg-white p-8 shadow-sm">
                <div className="mb-4 inline-flex rounded-lg bg-green-100 p-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Learn Progressively
                </h3>
                <p className="text-gray-600">
                  Challenges matched to your skill level, growing as you do.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              What Learners Are Saying
            </h2>
            <div className="mt-10 rounded-lg bg-gray-50 p-8">
              <blockquote className="text-lg text-gray-700">
                &ldquo;I used to just search for answers. Now I actually understand the concepts behind them. AI for Coders changed how I learn programming.&rdquo;
              </blockquote>
              <cite className="mt-6 block text-gray-600">
                — Sarah M., Software Engineering Student
              </cite>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
