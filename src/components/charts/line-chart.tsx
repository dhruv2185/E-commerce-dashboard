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

  const drawLineChart = () => {
    if (!svgRef.current || !data.length) return

    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim()
    const primaryHSL = `hsl(${primaryColor})`

    const margin = { top: 20, right: 20, bottom: 40, left: isMobile ? 40 : 60 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = svgRef.current.clientHeight - margin.top - margin.bottom

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, width])
      .padding(0.5)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) as number])
      .nice()
      .range([height, 0])

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px")

    svg.append("g").call(d3.axisLeft(y).ticks(5)).selectAll("text").style("font-size", "12px")

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
      .style("color", "black")

    svg
      .append("g")
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

    const line = d3
      .line<DataItem>()
      .x((d) => x(d.month) as number)
      .y((d) => y(d.value))
      .curve(d3.curveLinear)

    const path = svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#7F00FF")
      .attr("stroke-width", 2)
      .attr("d", line)

    const pathLength = path.node()?.getTotalLength() || 0
    path
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0)

    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.month) as number)
      .attr("cy", (d) => y(d.value))
      .attr("r", 0)
      .attr("fill", "#7F00FF")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("r", 6).attr("fill", primaryHSL)
        const [xPos, yPos] = d3.pointer(event, svgRef.current)
        tooltip
          .style("visibility", "visible")
          .html(`<strong>${d.month}</strong><br/>Value: ${d.value}`)
          .style("left", `${xPos + 10}px`)
          .style("top", `${yPos + 10}px`)
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 4).attr("fill", primaryHSL)
        tooltip.style("visibility", "hidden")
      })
      .transition()
      .delay((_, i) => i * 50)
      .duration(500)
      .attr("r", 4)

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Sales ($)")
  }

  useEffect(() => {
    drawLineChart()

    const handleResize = () => {
      drawLineChart()
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
