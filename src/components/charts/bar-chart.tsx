"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import * as motion from "motion/react-client"
import { useIsMobile } from "@/hooks/use-mobile"
import { toast } from "sonner"

interface DataItem {
  category: string
  value: number
  year: string
}

interface BarChartProps {
  data: DataItem[]
}

export default function BarChart({ data }: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!svgRef.current || !data?.length) return

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
      .attr("height", height + margin.top + margin.bottom )
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top -15})`)

    // X scale
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([0, width])
      .padding(0.3)

    // Y scale
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) as number])
      .nice()
      .range([height, 0])

    // Color scale
    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.category))
      .range(d3.schemeCategory10)

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
      .style("color","black")

    // Add bars with transition
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.category) as number)
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", (d) => color(d.category) as string)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8)
        const [x, y] = d3.pointer(event, svgRef.current)

        tooltip
          .style("visibility", "visible")
          .html(`<strong>${d.category}</strong><br/>Value: ${d.value}`)
          .style("left", `${x +10}px`)
          .style("top", `${y +10}px`)
      }).on("mousemove", function (event) {
        const [x, y] = d3.pointer(event, svgRef.current)
      
        tooltip
          .style("left", `${x+10}px`)
          .style("top", `${y+10 }px`)
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1)
        tooltip.style("visibility", "hidden")
      })
      .on("click", (event, d) => {
        toast(`Value: ${d.value} and Category: ${d.category}`)
      })
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value))

    // Add labels
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left )
      .attr("x", 0 - height / 2 )
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
