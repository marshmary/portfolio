'use client'
import Link from 'next/link'
import { TextMorph } from '@/components/ui/text-morph'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { useEffect, useState } from 'react'

function CopyButton() {
  const [text, setText] = useState('Copy')
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    setTimeout(() => {
      setText('Copy')
    }, 2000)
  }, [text])

  return (
    <button
      onClick={() => {
        setText('Copied')
        navigator.clipboard.writeText(currentUrl)
      }}
      className="font-base flex items-center gap-1 text-center text-sm text-zinc-500 transition-colors dark:text-zinc-400"
      type="button"
    >
      <TextMorph>{text}</TextMorph>
      <span>URL</span>
    </button>
  )
}

export default function LayoutBlogPost({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#eceff4]">
      <div className="fixed inset-0 -z-10 bg-[#eceff4]" aria-hidden />
      <div className="pointer-events-none fixed top-0 left-0 z-10 h-12 w-full bg-[#eceff4] to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <ScrollProgress
        className="fixed top-0 z-20 h-0.5 bg-[#4c566a]"
        springOptions={{
          bounce: 0,
        }}
      />

      <div className="absolute top-4 left-4 z-20">
        <Link
          href="/"
          className="rounded-lg border border-[#4c566a] px-3 py-1.5 font-mono text-xs text-[#3b4252] transition-colors hover:bg-[#4c566a] hover:text-[#eceff4]"
        >
          ← cd ~
        </Link>
      </div>

      <div className="absolute top-4 right-4">
        <CopyButton />
      </div>

      <main className="prose prose-h4:prose-base prose-h1:text-xl prose-h1:font-medium prose-h2:mt-12 prose-h2:scroll-m-20 prose-h2:text-lg prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-h4:font-medium prose-h5:text-base prose-h5:font-medium prose-h6:text-base prose-h6:font-medium prose-strong:font-medium mx-auto mt-24 max-w-2xl px-5 pb-20">
        {children}
      </main>
    </div>
  )
}
