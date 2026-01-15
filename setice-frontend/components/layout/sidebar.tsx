"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BookOpen, Users, GraduationCap, FolderKanban, ChevronLeft, Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Espaces", href: "/espaces", icon: BookOpen },
  { name: "Formateurs", href: "/formateurs", icon: Users },
  { name: "Étudiants", href: "/etudiants", icon: GraduationCap },
  { name: "Promotions", href: "/promotions", icon: FolderKanban },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity lg:hidden",
          collapsed ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
        onClick={() => setCollapsed(true)}
      />

      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-200 ease-in-out lg:translate-x-0",
          collapsed ? "-translate-x-full" : "translate-x-0",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold text-sm">
              S
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">SETICE</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setCollapsed(true)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* User info */}
        {user && (
          <div className="px-4 py-3 border-b border-sidebar-border">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.prenom} {user.nom}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.role === "DIRECTEUR_ETUDES" ? "Directeur des Études" : user.role}
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setCollapsed(true)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-sidebar-border">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Se déconnecter
          </button>
        </div>
      </aside>
    </>
  )
}
