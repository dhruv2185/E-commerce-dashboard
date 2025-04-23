"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

type ProductDataItem = {
  category: string
  value: number
  year: string
  id: string
  price: number
  rating: number
  name: string
}

type RadarChartProps = {
  data: ProductDataItem[]
}

type RadarDataPoint = {
  category: string
  avgRating: number
  avgPrice: number
  avgValue: number
}

export default function RadarChart({ data }: RadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return

    // Set dimensions with proper margins
    const margin = { top: 50, right: 80, bottom: 50, left: 80 }
    const width = 600 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom
    const radius = Math.min(width, height) / 2

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    // Process data to get averages by category
    const categoryMap = new Map<
      string,
      {
        totalRating: number
        totalPrice: number
        totalValue: number
        count: number
      }
    >()

    data.forEach((item) => {
      const current = categoryMap.get(item.category) || {
        totalRating: 0,
        totalPrice: 0,
        totalValue: 0,
        count: 0,
      }

      categoryMap.set(item.category, {
        totalRating: current.totalRating + item.rating,
        totalPrice: current.totalPrice + item.price,
        totalValue: current.totalValue + item.value,
        count: current.count + 1,
      })
    })

    // Convert to array of average values
    const radarData: RadarDataPoint[] = Array.from(categoryMap.entries()).map(
      ([category, totals]) => ({
        category,
        avgRating: totals.totalRating / totals.count,
        avgPrice: totals.totalPrice / totals.count,
        avgValue: totals.totalValue / totals.count,
      })
    )

    // Define the features/dimensions for the radar
    const features = ["avgRating", "avgPrice", "avgValue"]
    const featureNames = {
      avgRating: "Rating",
      avgPrice: "Price",
      avgValue: "Value",
    }

    // Find the maximum values for each feature for scaling
    const maxValues = {
      avgRating: d3.max(radarData, (d) => d.avgRating) || 5,
      avgPrice: d3.max(radarData, (d) => d.avgPrice) || 500,
      avgValue: d3.max(radarData, (d) => d.avgValue) || 10000,
    }

    // Create scales for each feature
    const scales: Record<string, d3.ScaleLinear<number, number>> = {}
    features.forEach((feature) => {
      scales[feature] = d3
        .scaleLinear()
        .domain([0, maxValues[feature as keyof typeof maxValues] * 1.1]) // Add 10% padding
        .range([0, radius])
    })

    // Calculate the angle for each feature
    const angleSlice = (Math.PI * 2) / features.length

    // Create SVG with proper dimensions
    const svg = d3
      .select(svgRef.current)
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
      )
      .style(
        "font-family",
        "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
      )
      .style("overflow", "visible")
      .append("g")
      .attr(
        "transform",
        `translate(${(width + margin.left + margin.right) / 2},${(height + margin.top + margin.bottom) / 2})`
      )

    // Generate color scale based on categories
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(radarData.map((d) => d.category))
      .range([
        "#3B82F6", // blue
        "#10B981", // green
        "#F59E0B", // amber
        "#EF4444", // red
        "#8B5CF6", // purple
      ])

    // Draw the circular grid
    const axisGrid = svg.append("g").attr("class", "axis-grid")

    // Draw the concentric circles
    const levels = 5
    for (let level = 0; level < levels; level++) {
      const levelFactor = radius * ((level + 1) / levels)

      // Draw the circles
      axisGrid
        .append("circle")
        .attr("r", levelFactor)
        .style("fill", "none")
        .style("stroke", "#ddd")
        .style("stroke-dasharray", "4 4")
    }

    // Create the straight lines radiating outward from the center
    const axis = axisGrid
      .selectAll(".axis")
      .data(features)
      .enter()
      .append("g")
      .attr("class", "axis")

    // Append the lines
    axis
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
      .style("stroke", "#ddd")
      .style("stroke-width", "1px")

    // Append the labels at each axis
    axis
      .append("text")
      .attr("class", "legend")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d, i) => (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d, i) => (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2))
      .text((d) => featureNames[d as keyof typeof featureNames])
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("fill", "#333")

    // Draw the radar chart blobs
    // Function to calculate path coordinates
    const radarLine = d3
      .lineRadial<[number, number]>()
      .curve(d3.curveLinearClosed)
      .radius((d) => d[0])
      .angle((d) => d[1])

    // Create radar paths
    radarData.forEach((category) => {
      // Create points array for this category
      const points: [number, number][] = features.map((feature, i) => {
        const featureKey = feature as keyof RadarDataPoint
        const value = category[featureKey] as number
        const scale = scales[feature]
        return [scale(value), angleSlice * i - Math.PI / 2]
      })

      // Draw the path
      svg
        .append("path")
        .datum(points)
        .attr("class", "radar-area")
        .attr("d", radarLine)
        .style("fill", colorScale(category.category))
        .style("fill-opacity", 0.3)
        .style("stroke", colorScale(category.category))
        .style("stroke-width", 2)

      // Add circle markers at data points
      points.forEach((point, i) => {
        svg
          .append("circle")
          .attr("cx", point[0] * Math.cos(point[1]))
          .attr("cy", point[0] * Math.sin(point[1]))
          .attr("r", 4)
          .style("fill", colorScale(category.category))
          .style("stroke", "#fff")
          .style("stroke-width", 1)
          .append("title")
          .text(
            `${category.category} - ${featureNames[features[i] as keyof typeof featureNames]}: ${
              features[i] === "avgRating"
                ? category.avgRating.toFixed(1)
                : features[i] === "avgPrice"
                  ? "$" + category.avgPrice.toFixed(0)
                  : "$" + category.avgValue.toFixed(0)
            }`
          )
      })
    })

    // Add legend
    const legendPadding = 20
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        `translate(${-width / 2 + margin.left / 2}, ${-height / 2 + margin.top / 2})`
      )

    radarData.forEach((category, i) => {
      const legendRow = legend.append("g").attr("transform", `translate(0, ${i * 20})`)

      legendRow
        .append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", colorScale(category.category))
        .attr("rx", 2)

      legendRow
        .append("text")
        .attr("x", 18)
        .attr("y", 10)
        .text(category.category)
        .style("font-size", "12px")
        .style("fill", "#333")
    })

    // Add title
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", -height / 2 -35)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "600")
      .text("Category Comparison - Rating, Price, Value")
  }, [data])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg ref={svgRef} width="100%" height="100%" className="overflow-visible" />
    </div>
  )
}
