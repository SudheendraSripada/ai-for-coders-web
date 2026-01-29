'use client'

import { useState } from 'react'
import { Play, RotateCcw, Copy, Check } from 'lucide-react'

interface CodeEditorProps {
  initialCode: string
  language: string
  onRun?: (code: string) => void
  readOnly?: boolean
}

export default function CodeEditor({
  initialCode,
  language,
  onRun,
  readOnly = false
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const handleReset = () => {
    setCode(initialCode)
    setOutput('')
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRun = () => {
    setIsRunning(true)
    setOutput('')
    
    setTimeout(() => {
      if (onRun) {
        onRun(code)
      } else {
        setOutput('// Output would appear here when connected to a code execution service.\n// For now, this is a placeholder.')
      }
      setIsRunning(false)
    }, 500)
  }

  const getLanguageClass = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python':
        return 'language-python'
      case 'java':
        return 'language-java'
      case 'c':
        return 'language-c'
      default:
        return 'language-text'
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-900 overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-2">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <span className="ml-2 text-sm text-gray-400 capitalize">
            {language}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            onClick={handleReset}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            title="Reset code"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          {onRun && (
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center space-x-1 rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>
          )}
        </div>
      </div>
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          readOnly={readOnly}
          className={`w-full resize-none bg-gray-900 p-4 font-mono text-sm text-gray-100 focus:outline-none ${readOnly ? 'opacity-75' : ''}`}
          style={{ minHeight: '200px', lineHeight: '1.5' }}
          spellCheck={false}
        />
      </div>
      {output && (
        <div className="border-t border-gray-700 bg-gray-800 p-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Output
          </h4>
          <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      )}
    </div>
  )
}
