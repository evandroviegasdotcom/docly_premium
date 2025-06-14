import React from 'react'
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
export default function Layout({ children }: {
    children: React.ReactNode
  }) {
  return (
    <SidebarProvider>
    <AppSidebar variant="inset" />
    <SidebarInset className='p-8'>
      {children}
    </SidebarInset>
  </SidebarProvider>
  )
}
