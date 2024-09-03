import * as d3 from 'd3'

export const BubbleSortD3 = (
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  data: number[]
) => {
  const width = +svg.attr('width')
  const height = +svg.attr('height')
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
    .attr('fill', 'steelblue')
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
