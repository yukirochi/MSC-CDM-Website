import { useState } from "react"
import {
  ChevronDown,
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-react"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Button } from "@/components/ui/button"
import logo from "@/assets/logo/a373d43f-61d3-4ecb-b6ae-4bef2e3d252f-removebg-preview.png"
import HomePage from "@/pages/Home"
import PagesRouter from "@/pages"

const navigationGroups = [
  {
    label: "Registration",
    items: ["Join the Community", "Membership Guidelines"],
  },
  { label: "News", items: ["Latest News", "Announcements"] },
  { label: "Events", items: ["Upcoming Events", "Event Calendar"] },
  { label: "Projects", items: ["Community Projects", "Upload Project"] },
  {
    label: "More",
    items: [
      "About the Community",
      "Our Team",
      "Resources",
      "Frequently Asked Questions",
      "Contact Us",
    ],
  },
]
type NavigationPage = (typeof navigationGroups)[number]["items"][number]
type AppPage = "Home" | NavigationPage

export function MenubarDemo({
  onNavigate,
}: {
  onNavigate: (page: AppPage) => void
}) {
  return (
    <Menubar className="w-auto max-w-full lg:mr-16">
      {navigationGroups.map((group) => (
        <MenubarMenu key={group.label}>
          <MenubarTrigger>{group.label}</MenubarTrigger>
          <MenubarContent>
            {group.items.map((item) => (
              <MenubarItem key={item} onSelect={() => onNavigate(item)}>
                {item}
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const [page, setPage] = useState<AppPage>("Home")

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <header className="flex w-full items-center justify-between gap-2 lg:pl-16">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <a
            href="/"
            aria-label="Home"
            className="shrink-0"
            onClick={(event) => {
              event.preventDefault()
              setPage("Home")
            }}
          >
            <img
              src={logo}
              alt="Home"
              className="size-12 object-contain sm:size-14 lg:size-16"
            />
          </a>
          <div className="min-w-0 font-poppins">
            <span className="block text-xs font-semibold leading-tight sm:text-sm lg:text-base lg:whitespace-nowrap">
              Microsoft Student Community
            </span>
            <span className="block text-[0.65rem] leading-tight sm:text-xs lg:text-sm">
              CDM
            </span>
          </div>
        </div>
        <div className="relative lg:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <CloseIcon aria-hidden="true" size={20} />
            ) : (
              <MenuIcon aria-hidden="true" size={20} />
            )}
          </Button>
          {menuOpen && (
            <nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              className="absolute right-0 top-full z-50 mt-2 flex w-[min(18rem,calc(100vw-3rem))] flex-col rounded-xl border border-border bg-background p-2 text-foreground shadow-lg"
            >
              <Button
                type="button"
                variant="ghost"
                className="h-auto w-full justify-start rounded-lg px-3 py-3 text-left"
                onClick={() => {
                  setPage("Home")
                  setMenuOpen(false)
                }}
              >
                Home
              </Button>
              {navigationGroups.map(({ label, items }) => {
                const isExpanded = expandedGroup === label
                const submenuId = `mobile-navigation-${label.toLowerCase()}`

                return (
                  <div key={label}>
                    <Button
                      type="button"
                      variant="ghost"
                      aria-expanded={isExpanded}
                      aria-controls={submenuId}
                      onClick={() =>
                        setExpandedGroup(isExpanded ? null : label)
                      }
                      className="h-auto w-full justify-between rounded-lg px-3 py-3 text-left"
                    >
                      {label}
                      <ChevronDown
                        aria-hidden="true"
                        className={`size-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </Button>
                    {isExpanded && (
                      <div
                        id={submenuId}
                        className="ml-3 flex flex-col border-l border-border pl-2"
                      >
                        {items.map((item) => (
                          <Button
                            key={item}
                            type="button"
                            variant="ghost"
                            className="h-auto w-full justify-start rounded-lg px-3 py-2.5 text-left text-muted-foreground"
                            onClick={() => {
                              setPage(item)
                              setMenuOpen(false)
                              setExpandedGroup(null)
                            }}
                          >
                            {item}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          )}
        </div>
        <div className="hidden w-full lg:block lg:w-auto">
          <MenubarDemo onNavigate={setPage} />
        </div>
      </header>
      {page === "Home" ? (
        <HomePage onJoinClick={() => setPage("Join the Community")} />
      ) : (
        <PagesRouter
          page={page}
          onJoinClick={() => setPage("Join the Community")}
        />
      )}
    </div>
  )
}

export default App
