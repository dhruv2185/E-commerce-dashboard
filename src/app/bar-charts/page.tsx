"use client"

import { useState } from "react"
import * as motion from "motion/react-client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { productData } from "@/lib/data"
import BarChart from "@/components/charts/bar-chart"

export default function Dashboard() {
  const [year, setYear] = useState<string>("2023")
  const years = ["2021", "2022", "2023", "2024"]

  const filteredProductData = productData.filter((item) => item.year === year)

  return (
    <div className="container mx-auto p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Sales Bar Dashboard</h1>
          <div className="flex items-center gap-4">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Product category breakdown for {year}</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart data={filteredProductData} />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
