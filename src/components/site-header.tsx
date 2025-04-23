"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function SiteHeader() {
  const { setTheme } = useTheme()
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-base font-medium">Documents</h1>
        {/* <div className="ml-auto flex items-center gap-2">
          <span className="sr-only">Toggle theme</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            className=" hidden sm:flex relative h-8 w-8 rounded-full p-0 transition-colors duration-200 ease-linear hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:hover:bg-primary/10"
          >
            <span className="sr-only">Toggle theme</span>
            <span className="absolute inset-0 rounded-full bg-primary/10 transition-all duration-200 ease-linear dark:bg-primary/10" />
            <span className="absolute inset-0 rounded-full bg-primary/10 transition-all duration-200 ease-linear dark:bg-primary/10" />
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div> */}
      </div>
    </header>
  )
}
