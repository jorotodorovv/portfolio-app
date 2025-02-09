'use client'

import { useEffect } from 'react'

import Prism from 'prismjs'

import '@/ui/prism-vsc-dark-plus.css'

import 'prismjs/components/prism-aspnet'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-cshtml'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-json'

interface CodeSnippetProps {
  code: string
  className: string | undefined
}

export default function CodeSnippet({ code, className }: CodeSnippetProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code])

  const match = /language-(\w+)/.exec(className || '');

  const styles: string | undefined = match ? `language-${match[1]}` : 'token function';

  return (
    <code className={styles}>{code}</code>
  )
}

