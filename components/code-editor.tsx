"use client"

import { useState, useEffect } from "react"
import { Highlight, themes } from "prism-react-renderer"
import { useTheme } from "next-themes"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  placeholder?: string
}

export default function CodeEditor({
  value,
  onChange,
  language = "javascript",
  placeholder = "// Write your code here",
}: CodeEditorProps) {
  const { theme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="border rounded-md min-h-[200px] p-4 bg-muted/30">
        <div className="animate-pulse h-4 w-3/4 bg-muted mb-2 rounded"></div>
        <div className="animate-pulse h-4 w-1/2 bg-muted mb-2 rounded"></div>
        <div className="animate-pulse h-4 w-2/3 bg-muted rounded"></div>
      </div>
    )
  }

  return (
    <div className="relative border rounded-md overflow-hidden">
      <Highlight
        theme={theme === "dark" ? themes.nightOwl : themes.github}
        code={value || placeholder}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} p-4 min-h-[200px] outline-none font-mono text-sm`} style={style}>
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent resize-none outline-none text-transparent caret-foreground"
              spellCheck="false"
            />
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

