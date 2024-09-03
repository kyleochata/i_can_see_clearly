import { useEffect, useRef } from 'react'
import './CodeHighlight.css'

interface CodeDisplayProps {
  currentLine: number[]
  code: string
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ currentLine, code }) => {
  const codeRef = useRef<HTMLPreElement | null>(null)

  useEffect(() => {
    if (codeRef.current) {
      const lines = codeRef.current.querySelectorAll('.code-line')
      lines.forEach((line, index) => {
        line.classList.remove('highlight')
        // Highlight all lines specified in currentLine
        if (currentLine.includes(index + 1)) {
          line.classList.add('highlight')
        }
      })
    }
  }, [currentLine])

  return (
    <div style={{ position: 'relative' }}>
      <pre ref={codeRef}>
        <code>
          {code.split('\n').map((line, index) => (
            <div key={index} className="code-line">
              {line}
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}

export default CodeDisplay
