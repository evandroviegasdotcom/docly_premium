"use client";

import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import { auth } from "@/services/auth";
import { subscription } from "@/services/subscription";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    onlyShowToProUsers?: boolean;
  }[];
}) {
  const pathname = usePathname();
  const { data: user } = useSWR("/api/authed", auth.getAuthedUser);
  const { data: isPro, isLoading } = useSWR("/api/is-pro", () =>
    subscription.isUserPro(user?.id || "")
  );

  if (isLoading) return "Loading...";
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Link href="/home/quick-upload" className="w-full">
              <SidebarMenuButton
                tooltip="Quick Create"
                className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              >
                <PlusCircleIcon />
                <span>Quick Upload</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
              const shouldShow = !item.onlyShowToProUsers || (item.onlyShowToProUsers && isPro)
              if(!shouldShow) return null
            return (
              <Link href={item.url}  key={item.title} className="cursor-pointer">
              <SidebarMenuItem
                className={cn(
                  item.url === pathname
                    ? "bg-primary/20 rounded-md text-black"
                    : ""
                )}
              >
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
