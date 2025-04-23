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

type TreemapChartProps = {
  data: ProductDataItem[]
}

// Define proper types for our hierarchy data structure
interface TreemapNode {
  name: string
  value?: number
  id?: string
  price?: number
  rating?: number
  children?: TreemapNode[]
}

// Extend d3's HierarchyNode type to include treemap-specific properties
interface TreemapHierarchyNode extends d3.HierarchyNode<TreemapNode> {
  x0?: number
  x1?: number
  y0?: number
  y1?: number
}

export default function TreemapChart({ data }: TreemapChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  
  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return
    
    // Set dimensions with proper margins
    const margin = { top: 10, right: 10, bottom: 10, left: 10 }
    const width = 900 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom
    
    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()
    
    // Process data into hierarchical structure
    const nest = d3.group(data, d => d.category)
    
    const hierarchyData: TreemapNode = {
      name: "root",
      children: Array.from(nest, ([category, values]) => ({
        name: category,
        children: values.map(item => ({
          name: item.name,
          value: item.value,
          id: item.id,
          price: item.price,
          rating: item.rating
        }))
      }))
    }
    
    // Create hierarchy with proper typing
    const root = d3.hierarchy<TreemapNode>(hierarchyData)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0))
    
    // Create treemap layout with improved padding
    const treemap = d3.treemap<TreemapNode>()
      .size([width, height])
      .paddingOuter(8)
      .paddingTop(24)
      .paddingInner(4)
      .round(true)
    
    // Apply treemap layout and cast to our extended type
    treemap(root as unknown as d3.HierarchyNode<TreemapNode>)
    
    // Create SVG with proper dimensions and margins
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .style("font-family", "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif")
      .style("overflow", "visible")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
    
    // Generate color scale based on categories with better colors
    const categories = Array.from(new Set(data.map(d => d.category)))
    const colorScale = d3.scaleOrdinal<string>()
      .domain(categories)
      .range([
        "#3B82F6", // blue
        "#10B981", // green
        "#F59E0B", // amber
        "#EF4444", // red
        "#8B5CF6", // purple
        "#EC4899", // pink
        "#06B6D4", // cyan
        "#F97316", // orange
        "#14B8A6", // teal
        "#6366F1"  // indigo
      ])
    
    // Create category (parent) groups
    const leaf = svg.selectAll("g.category")
      .data(root.descendants().filter(d => d.depth === 1) as TreemapHierarchyNode[])
      .join("g")
      .attr("class", "category")
      .attr("transform", d => `translate(${d.x0 || 0},${d.y0 || 0})`)
    
    // Add category headers with enhanced styling
    leaf.append("rect")
      .attr("fill", d => colorScale(d.data.name))
      .attr("width", d => (d.x1 || 0) - (d.x0 || 0))
      .attr("height", 24)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .attr("rx", 3) // rounded corners
    
    leaf.append("text")
      .attr("x", 8)
      .attr("y", 16)
      .attr("fill", "#fff")
      .attr("font-weight", "600")
      .attr("font-size", "12px")
      .text(d => d.data.name)
    
    // Create product (child) rectangles
    const cell = svg.selectAll(".product")
      .data(root.leaves() as TreemapHierarchyNode[])
      .join("g")
      .attr("class", "product")
      .attr("transform", d => `translate(${d.x0 || 0},${d.y0 || 0})`)
    
    // Add product rectangles with enhanced styling
    cell.append("rect")
      .attr("width", d => (d.x1 || 0) - (d.x0 || 0))
      .attr("height", d => (d.y1 || 0) - (d.y0 || 0))
      .attr("fill", d => {
        const parentName = d.parent?.data.name || ""
        const color = d3.color(colorScale(parentName))
        return color ? color.brighter(0.7).toString() : "#ccc"
      })
      .attr("stroke", d => {
        const parentName = d.parent?.data.name || ""
        return colorScale(parentName)
      })
      .attr("stroke-width", 1)
      .attr("rx", 2) // rounded corners
      .attr("fill-opacity", 0.85)
    
    // Add product names with better positioning and styling
    cell.append("text")
      .attr("x", 6)
      .attr("y", 14)
      .attr("font-size", d => {
        // Adjust font size based on rectangle dimensions
        const width = (d.x1 || 0) - (d.x0 || 0)
        const height = (d.y1 || 0) - (d.y0 || 0)
        return Math.min(width / 10, height / 10, 11) + "px"
      })
      .attr("font-weight", "700")
      .attr("fill", "#000")
      .style("text-overflow", "ellipsis")
      .style("white-space", "nowrap")
      .text(d => {
        const width = (d.x1 || 0) - (d.x0 || 0)
        // Truncate text if rectangle is too small
        return width < 60 ? d.data.name.substring(0, 3) + "..." : d.data.name
      })
    
    // Add product values with better styling
    cell.append("text")
      .attr("x", 6)
      .attr("y", 28)
      .attr("font-size", "13px")
      .attr("fill", "#555")
      .attr("font-weight", "400")
      .text(d => {
        const width = (d.x1 || 0) - (d.x0 || 0)
        // Only show value if there's enough space
        return width > 40 ? `$${d.data.value?.toLocaleString() || 0}` : ""
      })
    
    // Add tooltip on hover with more details
    cell.append("title")
      .text(d => {
        const data = d.data
        return `${data.name}\nCategory: ${d.parent?.data.name || ""}\nValue: $${data.value?.toLocaleString() || 0}\nPrice: $${data.price || 0}\nRating: ${data.rating || 0} / 5`
      })
      
    // Add interaction - highlight on hover
    cell.on("mouseover", function() {
      d3.select(this).select("rect")
        .transition()
        .duration(200)
        .attr("fill-opacity", 1)
        .attr("stroke-width", 2)
    })
    .on("mouseout", function() {
      d3.select(this).select("rect")
        .transition()
        .duration(200)
        .attr("fill-opacity", 0.85)
        .attr("stroke-width", 1)
    })
      
  }, [data])
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg ref={svgRef} width="100%" height="100%" className="overflow-visible" />
    </div>
  )
}