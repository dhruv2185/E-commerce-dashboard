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

import RadarChart from "@/components/charts/radar-chart"

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Radar Chart</CardTitle>
              <CardDescription>
                {" "}
                Comparing average rating, price, value for each category.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[450px]">
              <RadarChart data={productData} />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
