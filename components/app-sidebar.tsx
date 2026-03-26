"use client"

import type * as React from "react"
import {
  AudioWaveform,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Home,
  Cloud,
  Sun,
  AlertTriangle,
  TrendingUp,
  Sprout,
  Droplets,
  MapPin,
  ShoppingCart,
  Users,
  Phone,
  User,
  BarChart3,
  Leaf,
  DollarSign,
  FileText,
  Settings,
  ChevronRight,
} from "lucide-react"

import { NavUser } from "@/components/ui/nav-user"
import { TeamSwitcher } from "@/components/ui/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { usePathname } from "next/navigation"

// This is sample data.
const data = {
  user: {
    name: "Farmer John",
    email: "john@agrogenix.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  teams: [
    {
      name: "Agro-Genix",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Farm Management",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Crop Analytics",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Weather Intelligence",
      url: "/weather",
      icon: Cloud,
      items: [
        {
          title: "Current Weather",
          url: "/weather/current",
          icon: Sun,
        },
        {
          title: "Forecast",
          url: "/weather/forecast",
          icon: Cloud,
        },
        {
          title: "Weather Alerts",
          url: "/weather/alerts",
          icon: AlertTriangle,
        },
      ],
    },
    {
      title: "Soil Intelligence",
      url: "/soil-intelligence",
      icon: Leaf,
      items: [
        {
          title: "Soil Analysis",
          url: "/soil-analysis",
          icon: Leaf,
        },
        {
          title: "Fertilizer Recommendations",
          url: "/soil-analysis/fertilizer",
          icon: BarChart3,
        },
        {
          title: "Soil Health Report",
          url: "/soil-analysis/report",
          icon: FileText,
        },
      ],
    },
    {
      title: "AI Crop Advisory",
      url: "/crop-advisory",
      icon: Sprout,
      items: [
        {
          title: "Smart Crop Recommendations",
          url: "/crop-suggestions",
          icon: Sprout,
        },
        {
          title: "Yield Prediction",
          url: "/yield-prediction",
          icon: BarChart3,
        },
        {
          title: "Disease Prevention Insights",
          url: "/crop-advisory/disease-prevention",
          icon: AlertTriangle,
        },
      ],
    },
    {
      title: "Drone Crop Analytics",
      url: "/drone-analytics",
      icon: Frame,
      items: [
        {
          title: "Upload Drone Images",
          url: "/drone-analytics/upload",
          icon: Frame,
        },
        {
          title: "Crop Health Score",
          url: "/drone-analytics/health",
          icon: BarChart3,
        },
        {
          title: "Disease Detection",
          url: "/drone-analytics/disease",
          icon: AlertTriangle,
        },
        {
          title: "Stress Analysis",
          url: "/drone-analytics/stress",
          icon: TrendingUp,
        },
      ],
    },
    {
      title: "Market Linkage",
      url: "/market-analysis",
      icon: TrendingUp,
      items: [
        {
          title: "Price Trends",
          url: "/market-analysis/price-trends",
          icon: BarChart3,
        },
        {
          title: "Best Market Finder",
          url: "/market-analysis/best-markets",
          icon: Map,
        },
        {
          title: "Market Insights",
          url: "/market-analysis/market-insights",
          icon: PieChart,
        },
        {
          title: "Export Opportunities",
          url: "/market-analysis/export-opportunities",
          icon: DollarSign,
        },
        {
          title: "Direct Buyer Links",
          url: "/market-analysis/buyer-links",
          icon: Users,
        },
      ],
    },
    {
      title: "AI Services",
      url: "/agro-bot",
      icon: Bot,
    },
    {
      title: "AgriCare Alerts",
      url: "/agricare",
      icon: AlertTriangle,
      items: [
        {
          title: "Weather Risk Alerts",
          url: "/agricare/weather-alerts",
          icon: Cloud,
        },
        {
          title: "Pest Outbreak Warnings",
          url: "/agricare/pest-warnings",
          icon: AlertTriangle,
        },
        {
          title: "Irrigation Reminders",
          url: "/agricare/irrigation",
          icon: Droplets,
        },
        {
          title: "Price Drop Alerts",
          url: "/agricare/price-alerts",
          icon: TrendingUp,
        },
      ],
    },
    {
      title: "Smart Services",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Smart Irrigation",
          url: "/smart-irrigation",
          icon: Droplets,
        },
        {
          title: "GPS Crop Tracking",
          url: "/gps-integration",
          icon: MapPin,
        },
        {
          title: "Agro Tourism",
          url: "/agro-tourism",
          icon: Map,
        },
      ],
    },
    {
      title: "Government Services",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "Kisan Schemes",
          url: "/kisan-setu",
          icon: Users,
        },
        {
          title: "Agri Finance",
          url: "/agro-finance",
          icon: DollarSign,
        },
      ],
    },
    {
      title: "Marketplace",
      url: "/shop",
      icon: ShoppingCart,
    },
  ],
  projects: [
    {
      name: "Profile",
      url: "/profile",
      icon: User,
    },
    {
      name: "Contact",
      url: "/contact",
      icon: Phone,
    },
    {
      name: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const isActive =
                pathname === item.url || (item.items && item.items.some((subItem) => pathname === subItem.url))

              if (item.items) {
                return (
                  <Collapsible key={item.title} asChild defaultOpen={isActive} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                <a href={subItem.url}>
                                  {subItem.icon && <subItem.icon />}
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              }

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                    <a href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
          <SidebarMenu>
            {data.projects.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
