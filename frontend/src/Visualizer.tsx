// import React, { useEffect, useRef, useState } from 'react'
// import * as d3 from 'd3'

// const SortComponent: React.FC = () => {
//   const [data, setData] = useState<number[]>([5, 2, 9, 1, 5, 6])
//   const [sortedData, setSortedData] = useState<number[] | null>(null)
//   const [error, setError] = useState<string | null>(null)

//   const svgRef = useRef<SVGSVGElement | null>(null)

//   const sortData = async (algorithm: string, data: number[]): Promise<void> => {
//     const requestBody = { algorithm, data }

//     try {
//       const response = await fetch('http://localhost:8080/api/sort', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       })

//       if (!response.ok) {
//         throw new Error(`Error: ${response.status}`)
//       }

//       const responseData: number[] = await response.json()
//       setSortedData(responseData)
//     } catch (err: any) {
//       setError(err.message)
//     }
//   }

//   useEffect(() => {
//     if (sortedData && svgRef.current) {
//       // Clear previous visualization
//       d3.select(svgRef.current).selectAll('*').remove()

//       // Set up the SVG canvas dimensions
//       const svg = d3.select(svgRef.current)
//       const width = 500
//       const height = 300
//       const margin = { top: 20, right: 20, bottom: 30, left: 40 }

//       const x = d3
//         .scaleBand()
//         .domain(sortedData.map((_, i) => i.toString()))
//         .range([margin.left, width - margin.right])
//         .padding(0.1)

//       const y = d3
//         .scaleLinear()
//         .domain([0, d3.max(sortedData) || 0])
//         .nice()
//         .range([height - margin.bottom, margin.top])

//       svg
//         .append('g')
//         .attr('fill', 'steelblue')
//         .selectAll('rect')
//         .data(sortedData)
//         .join('rect')
//         .attr('x', (_, i) => x(i.toString())!)
//         .attr('y', (d) => y(d))
//         .attr('height', (d) => y(0) - y(d))
//         .attr('width', x.bandwidth())

//       svg
//         .append('g')
//         .attr('transform', `translate(0,${height - margin.bottom})`)
//         .call(
//           d3
//             .axisBottom(x)
//             .tickFormat((i) => i.toString())
//             .tickSizeOuter(0)
//         )

//       svg
//         .append('g')
//         .attr('transform', `translate(${margin.left},0)`)
//         .call(d3.axisLeft(y))
//     }
//   }, [sortedData])

//   return (
//     <div>
//       <h1>Sorting Algorithm Visualizer</h1>
//       <button onClick={() => sortData('bubble', data)}>
//         Sort with Bubble Sort
//       </button>
//       <button onClick={() => sortData('quick', data)}>
//         Sort with Quick Sort
//       </button>

//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {sortedData && (
//         <div>
//           <h2>Sorted Data Visualization:</h2>
//           <svg ref={svgRef} width={500} height={300}></svg>
//         </div>
//       )}
//     </div>
//   )
// }

// export default SortComponent
import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

const SortComponent: React.FC = () => {
  const [data, setData] = useState<number[]>([5, 2, 9, 1, 5, 6])
  const [originalData] = useState<number[]>([5, 2, 9, 1, 5, 6])
  const [sorting, setSorting] = useState<boolean>(false)
  const [highlight, setHighlight] = useState<number[]>([]) // Indices to highlight
  const [status, setStatus] = useState<string>('') // Status message
  const svgRef = useRef<SVGSVGElement | null>(null)

  const bubbleSort = async () => {
    setSorting(true)
    setStatus('Starting Bubble Sort...')
    const arr = [...data]
    const n = arr.length

    for (let i = 0; i < n; i++) {
      setStatus(`Pass ${i + 1}: Comparing elements...`)
      for (let j = 0; j < n - 1 - i; j++) {
        setHighlight([j, j + 1])
        if (arr[j] > arr[j + 1]) {
          // Swap elements
          const temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp

          // Update the state and animate the change
          setData([...arr])
          await new Promise((resolve) => setTimeout(resolve, 500)) // Wait 500ms for each swap
        }
        setHighlight([])
      }
    }
    setStatus('Bubble Sort completed!')
    setSorting(false)
  }

  const restartAnimation = () => {
    setData([...originalData])
    setStatus('')
    bubbleSort()
  }

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

      // Add status text
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height - margin.top)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .text(status)
    }
  }, [data, highlight, status])

  return (
    <div>
      <h1>Bubble Sort Visualization</h1>
      <button onClick={bubbleSort} disabled={sorting}>
        Start Bubble Sort
      </button>
      <button onClick={restartAnimation} disabled={sorting}>
        Restart Animation
      </button>
      <svg ref={svgRef} width={500} height={100}></svg>
    </div>
  )
}

export default SortComponent
