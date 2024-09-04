// import { useEffect, useRef } from 'react'
// import * as d3 from 'd3'
// import { BubbleSortD3 } from './sorting/BubbleSortD3'

// interface VisualizerProps {
//   data: number[]
//   highlight?: number[]
//   d3Props: {
//     width: number
//     height: number
//     margin: { top: number; right: number; bottom: number; left: number }
//   }
//   algorithm?: (
//     svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
//     data: number[],
//     highlight: number[]
//   ) => void
// }

// const Visualizer: React.FC<VisualizerProps> = ({
//   data,
//   highlight,
//   d3Props: { width, height, margin },
//   algorithm,
// }) => {
//   const svgRef = useRef<SVGSVGElement | null>(null)

//   useEffect(() => {
//     if (svgRef.current) {
//       const svg = d3.select(svgRef.current)
//       svg.selectAll('*').remove() // Clear previous SVG content

//       algorithm(svg, data, highlight || []) // Pass highlight array to BubbleSortD3, defaulting to an empty array if undefined
//     }
//   }, [data, highlight])

//   return <svg ref={svgRef} width={width} height={height}></svg>
// }

// export default Visualizer
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface VisualizerProps {
  data: number[]
  highlight?: number[]
  d3Props: {
    width: number
    height: number
    margin: { top: number; right: number; bottom: number; left: number }
  }
  algorithm?: (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    data: number[],
    highlight: number[]
  ) => void
}

const Visualizer: React.FC<VisualizerProps> = ({
  data,
  highlight = [],
  d3Props: { width, height, margin },
  algorithm,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (svgRef.current && algorithm) {
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove() // Clear previous SVG content

      algorithm(svg, data, highlight) // Pass highlight array to BubbleSortD3
    }
  }, [data, highlight, algorithm])

  return <svg ref={svgRef} width={width} height={height}></svg>
}

export default Visualizer
