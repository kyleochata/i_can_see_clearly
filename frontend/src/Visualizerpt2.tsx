import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

const SortComponent: React.FC = () => {
  const [data, setData] = useState<number[]>([5, 2, 9, 1, 5, 6]) //In future, grab from input
  const [originalData] = useState<number[]>([5, 2, 9, 1, 5, 6])
  const [sorting, setSorting] = useState<boolean>(false)
  const [highlight, setHighlight] = useState<number[]>([]) // Indices to highlight
  const [status, setStatus] = useState<string>('')
  const [iteration, setIteration] = useState<number>(0) // Total iterations
  const [currentLine, setCurrentLine] = useState<number>(0) // Line of code being highlighted
  const [states, setStates] = useState<number[][]>([]) // States array; contains snapshot of each step of the sort
  const [currentStateIndex, setCurrentStateIndex] = useState<number>(0) // Current state index
  const [currentIteration, setCurrentIteration] = useState<number>(0) // Current iteration
  const [comment, setComment] = useState<string>('') // Step-by-step comment
  const [comments, setComments] = useState<string[]>([]) // Comments array
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

      const { states, iterationCount, comments } = result

      setStates(states)
      setIteration(iterationCount)
      setComments(comments)
      setStatus(comments[0])
    } catch (error) {
      console.error('Error fetching sorting states:', error)
    }
  }

  //TODO: We have a comments object in the response, so we can use that to generate comments. We just need to figure out how to integrate it
  const generateComment = (stateIndex: number) => {
    if (stateIndex < states.length - 1) {
      // const currentState = states[stateIndex]
      // const nextState = states[stateIndex + 1]
      // console.log({ currentState, nextState })
      // for (let i = 0; i < currentState.length - 1; i++) {
      //   if (currentState[i] > currentState[i + 1]) {
      //     return `Comparing ${currentState[i]} and ${
      //       currentState[i + 1]
      //     }... Swap!`
      //   } else {
      //     if (currentState[i] !== nextState[i]) {
      //       return `Comparing ${currentState[i]} and ${
      //         currentState[i + 1]
      //       }... No Swap.`
      //     }
      //   }
      // }
      return comments[stateIndex]
    }
    return 'Sorting Completed.'
  }

  // const animateStep = async () => {
  //   if (currentStateIndex < states.length) {
  //     setData(states[currentStateIndex])
  //     setHighlight([]) // Clear highlights
  //     setCurrentLine(currentStateIndex + 1) // ArrowPointer line
  //     setComment(generateComment(currentStateIndex)) // Update the comment

  //     await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 500ms for each step
  //     setCurrentStateIndex((prevIndex) => prevIndex + 1)
  //     setCurrentIteration((prevIteration) => prevIteration + 1) // Increment current iteration
  //   } else {
  //     setStatus('Sorting completed!')
  //     setSorting(false)
  //   }
  // }
  const animateStep = async () => {
    if (currentStateIndex < states.length) {
      const currentState = states[currentStateIndex]
      const nextState =
        currentStateIndex < states.length - 1
          ? states[currentStateIndex + 1]
          : currentState

      // Find the indices that are different between the current and next state
      const compareIndices = []
      for (let i = 0; i < currentState.length - 1; i++) {
        if (
          currentState[i] !== nextState[i] ||
          currentState[i + 1] !== nextState[i + 1]
        ) {
          compareIndices.push(i, i + 1)
        }
      }

      // Remove duplicates and sort indices
      const uniqueIndices = Array.from(new Set(compareIndices)).sort(
        (a, b) => a - b
      )

      setHighlight(uniqueIndices) // Update highlight with unique indices
      setData(currentState)
      setCurrentLine(currentStateIndex + 1)
      setComment(comments[currentStateIndex])

      await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1000ms for each step
      setCurrentStateIndex((prevIndex) => prevIndex + 1)
      setCurrentIteration((prevIteration) => prevIteration + 1) // Increment current iteration
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
    setIteration(0)
    setCurrentIteration(0)
    setCurrentLine(0)
    setHighlight([])
    setComment('')
  }

  useEffect(() => {
    if (currentStateIndex < states.length) {
      const timer = setTimeout(() => {
        animateStep()
      }, 500) // Adjust timing here as needed

      return () => clearTimeout(timer) // Clean up timer on unmount or when state changes
    }
  }, [currentStateIndex, states])

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove() // Clear previous SVG content

      // const width = 500
      // const height = 100
      // const margin = { top: 20, right: 20, bottom: 20, left: 20 }

      // const xScale = d3
      //   .scaleBand()
      //   .domain(data.map((_, i) => i.toString()))
      //   .range([margin.left, width - margin.right])
      //   .padding(0.1)

      // const yScale = d3
      //   .scaleLinear()
      //   .domain([0, d3.max(data) || 0])
      //   .nice()
      //   .range([height - margin.bottom, margin.top])

      // svg
      //   .append('g')
      //   .selectAll('rect')
      //   .data(data)
      //   .join('rect')
      //   .attr('x', (_, i) => xScale(i.toString())!)
      //   .attr('y', (d) => yScale(d))
      //   .attr('width', xScale.bandwidth())
      //   .attr('height', (d) => height - margin.bottom - yScale(d))
      //   .attr('fill', (d, i) =>
      //     highlight.includes(i) ? 'orange' : 'steelblue'
      //   )
      //   .append('title')
      //   .text((d) => d.toString())

      // svg
      //   .append('g')
      //   .selectAll('text')
      //   .data(data)
      //   .join('text')
      //   .attr('x', (_, i) => xScale(i.toString())! + xScale.bandwidth() / 2)
      //   .attr('y', height / 2)
      //   .attr('dy', '.35em')
      //   .attr('text-anchor', 'middle')
      //   .attr('fill', 'white')
      //   .text((d) => d.toString())
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
          <div
            className="arrow-pointer"
            style={{ top: `${(currentLine - 1) * 24}px` }}
          ></div>
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
        Iteration: {currentIteration}/{iteration}
      </div>
      <div>
        Current Step: {currentStateIndex + 1}/{states.length}
      </div>
      <style>{`
        .code-line.highlight {
          background-color: yellow;
        }
        .arrow-pointer {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-bottom: 10px solid red;
          top: 0;
          left: 0;
          transform: translateX(-50%);
        }
      `}</style>
    </div>
  )
}

export default SortComponent
