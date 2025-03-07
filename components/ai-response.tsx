"use client"

import { useState, useEffect } from "react"
import { Highlight, themes } from "prism-react-renderer"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { CopyIcon, CheckIcon } from "lucide-react"

interface AIResponseProps {
  content: string
}

export function AIResponse({ content }: AIResponseProps) {
  const { theme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isMounted) {
    return <div className="animate-pulse h-20 bg-muted rounded"></div>
  }

  // Process content to extract code blocks
  const parts = []
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  let lastIndex = 0
  let match

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: content.slice(lastIndex, match.index),
      })
    }

    // Add code block
    parts.push({
      type: "code",
      language: match[1] || "javascript",
      content: match[2],
    })

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({
      type: "text",
      content: content.slice(lastIndex),
    })
  }

  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <div key={index} className="whitespace-pre-line">
              {part.content}
            </div>
          )
        } else if (part.type === "code") {
          return (
            <div key={index} className="relative group">
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleCopy}
              >
                {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
              </Button>
              <Highlight
                theme={theme === "dark" ? themes.nightOwl : themes.github}
                code={part.content}
                language={part.language}
              >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-4 rounded-md overflow-x-auto`} style={style}>
                    {tokens.map((line, i) => {
                      // Get line props without the key
                      const { key: _lineKey, ...lineProps } = getLineProps({ line, key: i })
                      return (
                        <div key={i} {...lineProps}>
                          {line.map((token, key) => {
                            // Get token props without the key
                            const { key: _tokenKey, ...tokenProps } = getTokenProps({ token, key })
                            return <span key={key} {...tokenProps} />
                          })}
                        </div>
                      )
                    })}
                  </pre>
                )}
              </Highlight>
            </div>
          )
        }
      })}
    </div>
  )
}

