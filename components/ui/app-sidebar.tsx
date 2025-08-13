"use client";

import * as React from "react";
import {
  File,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  Home,
  Bookmark,
  Gem,
} from "lucide-react";

import { NavMain } from "@/components/ui/nav-main";
import { NavSecondary } from "@/components/ui/nav-secondary";
import { NavUser } from "@/components/ui/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: Home,
    },
    {
      title: "Dashboard",
      url: "/home/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "My Documents",
      url: "/home/documents",
      icon: File,
    },
    {
      title: "Favorites",
      url: "/home/favorites",
      icon: Bookmark,
      onlyShowToProUsers: true
    },
  ],
  navSecondary: [
    {
      title: "Plans",
      url: "/plans",
      icon: Gem,
      showToProUsers: false
    },
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div>
                <Image
                  src="/logo.png"
                  width={30}
                  height={30}
                  alt="Docly"
                  className="object-contain"
                />
                <span className="text-base font-bold">Docly</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
