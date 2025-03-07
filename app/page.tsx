"use client"

import CodeEditor from "@/components/code-editor"
import ThemeToggle from "@/components/theme-toggle"

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center justify-between py-4 px-6 border-b">
        <h1 className="text-2xl font-bold">CodeSolve AI</h1>
        <ThemeToggle />
      </header>
      <main className="flex-grow p-6">
        <CodeEditor value="" onChange={() => {}} />
      </main>
      <footer className="py-2 px-6 border-t text-center text-sm text-muted-foreground">&copy; 2024 CodeSolve AI</footer>
    </div>
  )
}

