"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import * as motion from "motion/react-client"

import { useIsMobile } from "@/hooks/use-mobile"

interface DataItem {
  id: string
  price: number
  rating: number
  name: string
  year: string
}

interface ScatterPlotProps {
  data: DataItem[]
}

export default function ScatterPlot({ data }: ScatterPlotProps) {
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
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.price) as number])
      .nice()
      .range([0, width])

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([0, 5]) // Rating from 0-5
      .nice()
      .range([height, 0])

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll("text")
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

    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .tickSize(-height)
          .tickFormat(() => "")
      )
      .style("stroke-dasharray", "3,3")
      .style("stroke-opacity", 0.2)
      .selectAll("line")
      .style("stroke", "#ddd")

    // Add dots with transition
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.price))
      .attr("cy", (d) => y(d.rating))
      .attr("r", 0)
      .attr("fill", "hsl(var(--primary))")
      .attr("opacity", 0.7)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 8).attr("opacity", 1)
        tooltip
          .style("visibility", "visible")
          .html(`<strong>${d.name}</strong><br/>Price: $${d.price}<br/>Rating: ${d.rating}/5`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`)
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 6).attr("opacity", 0.7)
        tooltip.style("visibility", "hidden")
      })
      .transition()
      .delay((d, i) => i * 30)
      .duration(500)
      .attr("r", 6)

    // Add labels
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 15)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Rating (0-5)")

    svg
      .append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 5})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Price ($)")

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
