"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar,
  CreditCard,
  Lightbulb,
  Plus,
  Setting06Icon,
} from "@hugeicons/core-free-icons";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import { Logo } from "./logo";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

import { cn } from "@/lib/utils";

import { ChannelType } from "@/types/channel.type";

import { getChannelIcon } from "@/constants/channels";

const mainNav = [
  { name: "Ideas", href: "/ideas", icon: Lightbulb },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Setting06Icon },
];

export function AppSidebar() {
  const pathName = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const { data: channelsData, isPending } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const res = await fetch("/api/channel");
      const data = await res.json();
      return data;
    },
  });

  const channels = (channelsData?.channels || []) as ChannelType[];
  const unconnectedChannels = channels.filter(
    (channel: ChannelType) => !channel.connected,
  );

  const connectedCount = channelsData?.connectedCount || 0;
  const totalChannels = channelsData?.totalChannels || 0;
  const limitedChannels = unconnectedChannels.slice(0, 4);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className={cn("p-4", isCollapsed && "p-2")}>
        <div className="flex items-center justify-between">
          <Logo
            hideName={isCollapsed}
            className={isCollapsed ? "justify-center" : ""}
          />
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
                  <SidebarMenuButton
                    asChild
                    isActive={pathName === item.href}
                    tooltip={item.name}
                  >
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

        {/* Connect Channels Section */}

        {/* Unconnected Channels*/}
        <SidebarGroup className={cn(isCollapsed && "px1")}>
          <SidebarGroupLabel className="text-sm">
            Connect Your Channels
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isPending ? (
                <div className="flex flex-col gap-4">
                  <Skeleton className="bg-secondary h-8 w-full" />
                  <Skeleton className="bg-secondary h-8 w-full" />
                  <Skeleton className="bg-secondary h-8 w-full" />
                  <Skeleton className="bg-secondary h-8 w-full" />
                </div>
              ) : (
                <></>
              )}
              {limitedChannels.map((channel: ChannelType) => {
                const icon = getChannelIcon(channel.type);
                return (
                  <SidebarMenuItem key={channel.id}>
                    <SidebarMenuButton
                      asChild
                      tooltip={`Connect ${channel.name}`}
                    >
                      <Button className="w-full flex items-center gap-2">
                        <span>
                          <div className="relative">
                            {icon ? (
                              <HugeiconsIcon
                                icon={icon}
                                size={4}
                                color="currentColor"
                                className="text-white! size-6! p-1 rounded-sm"
                                style={{ background: channel.color }}
                              />
                            ) : null}

                            <div
                              className={`absolute -right-1 bottom-0 p-0.5 bg-white dark:bg-background rounded-xs`}
                            ></div>
                          </div>
                        </span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className={cn("p-4", isCollapsed && "p-2")}>
        <Show when="signed-in">
          <div
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "gap-3",
            )}
          >
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 ring-2 ring-border",
                },
              }}
            />
            {!isCollapsed && (
              <span className="text-xs text-muted-foreground truncate">
                Account
              </span>
            )}
          </div>
        </Show>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button
              variant="outline"
              size={isCollapsed ? "icon" : "sm"}
              className="w-full"
            >
              {isCollapsed ? "→" : "Sign In"}
            </Button>
          </SignInButton>
        </Show>
      </SidebarFooter>
    </Sidebar>
  );
}
