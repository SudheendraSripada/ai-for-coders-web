'use client'

import { ReactNode } from 'react'

interface AuthFormProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function AuthForm({ title, subtitle, children }: AuthFormProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
