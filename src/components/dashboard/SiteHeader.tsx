'use client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useTheme } from '@/hooks/use-theme'
import { IconMoonFilled, IconSunFilled } from '@tabler/icons-react'
import { DynamicBreadcrumb } from './DynamicBreadcrumb'

export function SiteHeader() {
  const { theme, setTheme } = useTheme()
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <DynamicBreadcrumb />
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="secondary"
            asChild
            size="icon"
            className="flex rounded-full p-[10px] cursor-pointer dark:text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <IconSunFilled className="text-foreground w-2 h-2" />
            ) : (
              <IconMoonFilled className="text-foreground" />
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
