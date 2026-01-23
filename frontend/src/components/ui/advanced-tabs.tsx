// frontend/src/components/ui/advanced-tabs.tsx
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const [activeTab, setActiveTab] = React.useState<string | null>(null)
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 })

  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (containerRef.current && activeTab) {
      const activeElement = containerRef.current.querySelector(`[data-state="active"]`) as HTMLElement
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth })
      }
    }
  }, [activeTab])

  return (
    <div className="relative">
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          "inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-1.5 text-gray-500 shadow-inner",
          className
        )}
        {...props}
      >
        <div ref={containerRef} className="flex items-center gap-1">
          {children}
        </div>
      </TabsPrimitive.List>
      {activeTab && (
        <motion.div
          className="absolute bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
          initial={{ width: 0, left: 0 }}
          animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}
    </div>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    icon?: React.ReactNode
    badge?: string | number
  }
>(({ className, children, icon, badge, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative inline-flex items-center justify-center gap-2 whitespace-nowrap px-6 py-3 text-sm font-medium transition-all",
      "rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-white data-[state=active]:to-white/90",
      "data-[state=active]:text-gray-900 data-[state=active]:shadow-lg",
      "data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-white/50",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  >
    {icon && <span className="h-4 w-4">{icon}</span>}
    <span>{children}</span>
    {badge && (
      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs font-bold text-white">
        {badge}
      </span>
    )}
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "animate-in fade-in-80",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }