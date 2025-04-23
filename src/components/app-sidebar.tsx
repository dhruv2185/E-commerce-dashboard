"use client"

import * as React from "react"
import {
  IconChartAreaLine,
  IconChartBar,
  IconChartRadar,
  IconChartScatter,
  IconChartTreemap,
  IconHome,
  IconInnerShadowTop,
  IconSettings,
} from "@tabler/icons-react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const data = {
  user: {
    name: "dhruv2185",
    email: "dhruvghevariya2002@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconHome,
    },
    {
      title: "Bar Charts",
      url: "/bar-charts",
      icon: IconChartBar,
    },
    {
      title: "Line Charts",
      url: "/line-charts",
      icon: IconChartAreaLine,
    },
    {
      title: "Scatter Plots",
      url: "/scatter-plots",
      icon: IconChartScatter,
    },
    {
      title: " Tree Map",
      url: "/tree-map",
      icon: IconChartTreemap,
    },
    {
      title: "Radar Chart",
      url: "/radar-chart",
      icon: IconChartRadar,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">E-commerce Sales</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
