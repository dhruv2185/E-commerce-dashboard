"use client"

import { usePathname } from "next/navigation"
import {  type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import clsx from "clsx"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url

            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url} className="flex items-center gap-2 w-full">
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={clsx(
                      "w-full flex items-center gap-2 px-3 py-7 rounded-md transition-colors",
                      {
                        "bg-muted text-primary font-semibold": isActive,
                        "hover:bg-muted": !isActive,
                      }
                    )}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
