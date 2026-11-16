import EventCalendarPage from "@/pages/Events/EventCalendarPage"
import UpcomingEventsPage from "@/pages/Events/UpcomingEventsPage"

function EventsPage({ page }: { page: string }) {
  if (page === "Event Calendar") return <EventCalendarPage />
  return <UpcomingEventsPage />
}

export default EventsPage
