'use client'

import { motion } from "motion/react"

export default function Transition({ children, id }: { children: React.ReactNode, id?: string | null }) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1 }}>
      {children}
    </motion.div>
  )
}