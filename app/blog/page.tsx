'use client'

import BlogList from "@/components/BlogList"
import { Suspense } from "react"

export default function Blog() {
  return (
    <Suspense>
      <BlogList />
    </Suspense>
  )
}

