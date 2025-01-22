'use client'

import { useEffect } from 'react'

import Prism from 'prismjs'

import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-bash'

interface CodeSnippetProps {
  code: string
  language: string
}

export default function CodeSnippet({ code, language }: CodeSnippetProps) {
  useEffect(() => {
    Prism.highlightAll()
  }, [code])

  return (
    <code className={`rounded-md language-${language}`}>{code}</code>
  )
}

