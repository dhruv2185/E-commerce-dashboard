"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import * as motion from "motion/react-client"

import { useIsMobile } from "@/hooks/use-mobile"

interface DataItem {
  month: string
  value: number
  year: string
}

interface LineChartProps {
  data: DataItem[]
}

export default function LineChart({ data }: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    // Set dimensions
    const margin = { top: 20, right: 20, bottom: 40, left: isMobile ? 40 : 60 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = svgRef.current.clientHeight - margin.top - margin.bottom

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // X scale
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, width])
      .padding(0.1)

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) as number])
      .nice()
      .range([height, 0])

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px")

    // Add Y axis
    svg.append("g").call(d3.axisLeft(y).ticks(5)).selectAll("text").style("font-size", "12px")

    // Create tooltip
    const tooltip = d3
      .select(tooltipRef.current)
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("pointer-events", "none")
      .style("font-size", "12px")
      .style("box-shadow", "0 2px 5px rgba(0, 0, 0, 0.1)")

    // Add grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .tickSize(-width)
          .tickFormat(() => "")
      )
      .style("stroke-dasharray", "3,3")
      .style("stroke-opacity", 0.2)
      .selectAll("line")
      .style("stroke", "#ddd")

    // Create line generator
    const line = d3
      .line<DataItem>()
      .x((d) => (x(d.month) as number) + x.bandwidth() / 2)
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX)

    // Add the line path with transition
    const path = svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-width", 2)
      .attr("d", line)

    // Animate the line
    const pathLength = path.node()?.getTotalLength() || 0
    path
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0)

    // Add dots
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => (x(d.month) as number) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.value))
      .attr("r", 0)
      .attr("fill", "hsl(var(--primary))")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 6).attr("fill", "hsl(var(--primary))")
        tooltip
          .style("visibility", "visible")
          .html(`<strong>${d.month}</strong><br/>Value: ${d.value}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`)
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 4).attr("fill", "hsl(var(--primary))")
        tooltip.style("visibility", "hidden")
      })
      .transition()
      .delay((d, i) => i * 50)
      .duration(500)
      .attr("r", 4)

    // Add labels
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 15)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Sales ($)")

    // Handle resize
    const handleResize = () => {
      if (svgRef.current) {
        d3.select(svgRef.current).selectAll("*").remove()
        // Re-render chart (simplified - in production would call the chart creation function)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [data, isMobile])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full"
    >
      <svg ref={svgRef} width="100%" height="100%" />
      <div ref={tooltipRef} className="tooltip" />
    </motion.div>
  )
}
