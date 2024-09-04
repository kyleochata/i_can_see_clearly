import React, { useState, useEffect } from 'react'
import Visualizer from '../Visualization'
import CodeDisplay from '../CodeHighlight'
import Controls from '../Controls'

const BubbleSortComponent: React.FC = () => {
  const [data, setData] = useState<number[]>([5, 2, 9, 1, 5, 6])
  const [originalData] = useState<number[]>([5, 2, 9, 1, 5, 6])
  const [sorting, setSorting] = useState<boolean>(false)
  const [highlight, setHighlight] = useState<number[]>([])
  const [currentLine, setCurrentLine] = useState<number[]>([]) // Array to hold current lines to highlight
  const [states, setStates] = useState<number[][]>([])
  const [currentStateIndex, setCurrentStateIndex] = useState<number>(-1)
  const [comment, setComment] = useState<string>(
    'Click to watch Bubble Sort in action!'
  )
  const [comments, setComments] = useState<string[]>([])
  const [compareIndices, setCompareIndices] = useState<number[][]>([])
  const [lineNumbers, setLineNumbers] = useState<number[][]>([]) // State to hold line numbers

  const fetchSortingStates = async () => {
    setSorting(true)
    setCurrentStateIndex(0)
    setCurrentLine([])

    try {
      const response = await fetch('http://localhost:8080/api/sort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: 'bubble', data: originalData }),
      })

      const result = await response.json()
      const { states, comments, comparedIndex, lineNumbers } = result

      // Check if lineNumbers is properly set
      if (!Array.isArray(lineNumbers)) {
        throw new Error('Invalid lineNumbers format')
      }

      setStates(states)
      setComments(comments)
      setCompareIndices(comparedIndex)
      setLineNumbers(lineNumbers)
    } catch (error) {
      console.error('Error fetching sorting states:', error)
    }
  }

  const animateStep = async () => {
    if (currentStateIndex < states.length) {
      const currentState = states[currentStateIndex]
      const currentHighlightIndices = compareIndices[currentStateIndex]
      setHighlight(currentHighlightIndices)

      setData(currentState)

      const currentLineNumbers = lineNumbers[currentStateIndex]
      if (Array.isArray(currentLineNumbers)) {
        setCurrentLine(currentLineNumbers)
      } else {
        setCurrentLine([]) // Default to an empty array if data is not available
      }

      setComment(comments[currentStateIndex])

      await new Promise((resolve) => setTimeout(resolve, 800))
      setCurrentStateIndex((prevIndex) => prevIndex + 1)
    } else {
      setSorting(false)
      setComment('Sorting complete!')
      setHighlight([])
      console.log({ comment })
    }
  }

  const resetVisualization = () => {
    setData(originalData)
    setCurrentStateIndex(0)
    setSorting(false)
    setCurrentLine([])
    setHighlight([])
    setComment('')
  }

  useEffect(() => {
    if (currentStateIndex === -1) {
      return
    }
    if (currentStateIndex <= states.length) {
      const timer = setTimeout(() => {
        animateStep()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [currentStateIndex, states])

  const code = `
func bubbleSort(arr []int) {
  n := len(arr)
  for i := 0; i < n; i++ {
    for j := 0; j < n - 1 - i; j++ {
      if arr[j] > arr[j + 1] {
        arr[j], arr[j + 1] = arr[j + 1], arr[j]
      }
    }
  }
}`
  const getCurrentStep = (currentStateIndex: number, totalStates: number) => {
    if (currentStateIndex === -1) {
      return `0 / ${totalStates}`
    } else if (currentStateIndex > totalStates) {
      return `${currentStateIndex - 1} / ${totalStates}`
    } else {
      return `${currentStateIndex} / ${totalStates}`
    }
  }

  return (
    <div style={{ height: '100vh' }}>
      <h1>Bubble Sort Visualization</h1>
      <CodeDisplay currentLine={currentLine} code={code} />
      <h3>Original Data</h3>
      <Visualizer
        data={originalData}
        highlight={[]}
        d3Props={{
          width: 500,
          height: 100,
          margin: { top: 20, right: 20, bottom: 20, left: 20 },
        }}
      />
      <h3>Sorting in Action!</h3>
      <Visualizer
        data={data}
        highlight={highlight}
        d3Props={{
          width: 500,
          height: 100,
          margin: { top: 20, right: 20, bottom: 20, left: 20 },
        }}
      />
      <div style={{ marginTop: '20px' }}>
        <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
          {comment}
        </p>
      </div>
      <Controls
        onStart={fetchSortingStates}
        onReset={resetVisualization}
        isSorting={sorting}
      />
      <div>
        Current Step: {getCurrentStep(currentStateIndex, states.length)}
      </div>
    </div>
  )
}

export default BubbleSortComponent
