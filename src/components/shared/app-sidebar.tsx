"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar, CreditCard, Lightbulb, Plus, Setting06Icon } from "@hugeicons/core-free-icons"

import { Logo } from "./logo"
import { Button } from "../ui/button"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "../ui/sidebar"

import { cn } from "@/lib/utils"

const mainNav = [
    { name: "Ideas", href: "/ideas", icon: Lightbulb },
    { name: "Schedule", href: "/schedule", icon: Calendar },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Setting06Icon },
]

export function AppSidebar() {

    const pathName = usePathname()
    const { state } = useSidebar()
    const isCollapsed = state === "collapsed"

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className={cn("p-4", isCollapsed && "p-2")}>
                <div className="flex items-center justify-between">
                    <Logo hideName={isCollapsed} className={isCollapsed ? "justify-center" : ""} />
                    <SidebarTrigger className="hidden md:flex -mx-8 mb-0" />
                </div>
                <Button className="mt-4 w-full" size={isCollapsed ? "icon" : "lg"}>
                    <HugeiconsIcon icon={Plus} size={4} />
                    {!isCollapsed && <span>New Post</span>}
                </Button>
            </SidebarHeader>
            <SidebarContent className={cn(!isCollapsed && "px-2")}>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNav.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton asChild isActive={pathName === item.href} tooltip={item.name}>
                                        <Link href={item.href}>
                                            <HugeiconsIcon icon={item.icon} size={4} />
                                            <span className="text-sm">{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
