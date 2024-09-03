import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface VisualizerProps {
  data: number[]
  highlight: number[]
  d3Props: {
    width: number
    height: number
    margin: { top: number; right: number; bottom: number; left: number }
  }
}

const Visualizer: React.FC<VisualizerProps> = ({
  data,
  highlight,
  d3Props: { width, height, margin },
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove() // Clear previous SVG content

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
  }, [data, highlight])

  return <svg ref={svgRef} width={width} height={height}></svg>
}

export default Visualizer
