import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

const SortComponent: React.FC = () => {
  const [data, setData] = useState<number[]>([5, 2, 9, 1, 5, 6]) //In future, grab from input
  const [originalData] = useState<number[]>([5, 2, 9, 1, 5, 6])
  const [sorting, setSorting] = useState<boolean>(false)
  const [highlight, setHighlight] = useState<number[]>([]) // Indices to highlight
  const [status, setStatus] = useState<string>('')
  //const [iteration, setIteration] = useState<number>(0) // Total iterations
  const [currentLine, setCurrentLine] = useState<number>(0) // Line of code being highlighted
  const [states, setStates] = useState<number[][]>([]) // States array; contains snapshot of each step of the sort
  const [currentStateIndex, setCurrentStateIndex] = useState<number>(0) // Current state index
  const [currentIteration, setCurrentIteration] = useState<number>(0) // Current iteration
  const [comment, setComment] = useState<string>('') // Step-by-step comment
  const [comments, setComments] = useState<string[]>([]) // Comments array
  const [compareIndices, setCompareIndices] = useState<number[][]>([])

  const svgRef = useRef<SVGSVGElement | null>(null)
  const codeRef = useRef<HTMLPreElement | null>(null)

  const fetchSortingStates = async () => {
    setSorting(true)
    setStatus('Starting Bubble Sort...')
    setCurrentStateIndex(0)
    setCurrentIteration(0)
    setCurrentLine(0)

    try {
      const response = await fetch('http://localhost:8080/api/sort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: 'bubble', data: originalData }),
      })

      const result = await response.json()

      const { states, comments, comparedIndex } = result
      console.log({ comparedIndex })
      setStates(states)
      //setIteration(iterationCount)
      setComments(comments)
      setCompareIndices(comparedIndex)
      setStatus(comments[0])
    } catch (error) {
      console.error('Error fetching sorting states:', error)
    }
  }

  const animateStep = async () => {
    if (currentStateIndex < states.length) {
      const currentState = states[currentStateIndex]

      // Use compareIndices to highlight the boxes being compared
      const currentHighlightIndices = compareIndices[currentStateIndex]
      setHighlight(currentHighlightIndices)

      setData(currentState)
      setCurrentLine(currentStateIndex + 1)
      setComment(comments[currentStateIndex])

      //Timer for waiting between each step
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCurrentStateIndex((prevIndex) => prevIndex + 1)
      setCurrentIteration((prevIteration) => prevIteration + 1)
    } else {
      setStatus('Sorting completed!')
      setSorting(false)
    }
  }

  const resetVisualization = () => {
    setData(originalData)
    setCurrentStateIndex(0)
    setSorting(false)
    setStatus('')
    //setIteration(0)
    setCurrentIteration(0)
    setCurrentLine(0)
    setHighlight([])
    setComment('')
  }

  useEffect(() => {
    if (currentStateIndex < states.length) {
      const timer = setTimeout(() => {
        animateStep()
      }, 1000)

      return () => clearTimeout(timer) // Clean up timer on unmount or when state changes
    }
  }, [currentStateIndex, states])

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove() // Clear previous SVG content

      // Define scales and margins
      const width = 500
      const height = 100
      const margin = { top: 20, right: 20, bottom: 20, left: 20 }

      const xScale = d3
        .scaleBand()
        .domain(data.map((_, i) => i.toString()))
        .range([margin.left, width - margin.right])
        .padding(0.1)

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data) || 0])
        .nice()
        .range([height - margin.bottom, margin.top])

      // Draw boxes
      svg
        .append('g')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', (_, i) => xScale(i.toString())!)
        .attr('y', margin.top)
        .attr('width', xScale.bandwidth())
        .attr('height', height - margin.bottom - margin.top)
        .attr('fill', (d, i) =>
          highlight.includes(i) ? 'orange' : 'steelblue'
        )
        .append('title')
        .text((d) => d.toString())

      // Draw text inside boxes
      svg
        .append('g')
        .selectAll('text')
        .data(data)
        .join('text')
        .attr('x', (_, i) => xScale(i.toString())! + xScale.bandwidth() / 2)
        .attr('y', height / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text((d) => d.toString())
    }
  }, [data, highlight, status])

  useEffect(() => {
    if (codeRef.current) {
      const lines = codeRef.current.querySelectorAll('.code-line')
      lines.forEach((line, index) => {
        line.classList.remove('highlight')
        if (index + 1 === currentLine) {
          line.classList.add('highlight')
        }
      })
    }
  }, [currentLine])

  return (
    <div>
      <h1>Bubble Sort Visualization</h1>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <pre ref={codeRef}>
            <code>
              {`func bubbleSort(arr []int) {`}
              <br />
              {`  n := len(arr)`}
              <br />
              {`  for i := 0; i < n; i++ {`}
              <br />
              {`    for j := 0; j < n - 1 - i; j++ {`}
              <br />
              {`      if arr[j] > arr[j + 1] {`}
              <br />
              {`        arr[j], arr[j + 1] = arr[j + 1], arr[j]`}
              <br />
              {`      }`}
              <br />
              {`    }`}
              <br />
              {`  }`}
              <br />
              {`}`}
            </code>
          </pre>
        </div>
      </div>
      <svg ref={svgRef} width={500} height={100}></svg>
      <div style={{ marginTop: '20px' }}>
        <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
          {comment}
        </p>
      </div>
      <button onClick={fetchSortingStates} disabled={sorting}>
        Start Sorting
      </button>
      <button onClick={resetVisualization}>Reset</button>
      <div>
        Current Step: {currentStateIndex + 1}/{states.length}
      </div>
    </div>
  )
}

export default SortComponent
