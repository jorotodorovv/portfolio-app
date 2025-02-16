'use client'
import React, { useState } from 'react';

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

import Lazy from './base/Lazy';

interface CodeSnippetProps {
  code: string
  className: string | undefined
}

export default function CodeSnippet({ code, className }: CodeSnippetProps) {
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);

  const match = /language-(\w+)/.exec(className || '');

  const styles: string | undefined = match ?
    `language-${match[1]}` : 
    'token function bg-code px-1';

  const highlightCode = (codeElement : HTMLElement) => {
    if (codeElement && !isHighlighted) {
      Prism.highlightElement(codeElement);
      setIsHighlighted(true);
    }
  };

  const renderCode = (codeRef: React.RefObject<HTMLElement>) =>
    <code ref={codeRef} className={`${styles} text-base leading-relaxed`}>{code}</code>;

  return <Lazy
    render={renderCode}
    onObserve={highlightCode}
    state={[code, className]} />
}