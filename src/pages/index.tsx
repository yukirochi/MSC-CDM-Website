import RegistrationPage from "@/pages/Registration"
import NewsPage from "@/pages/News"
import EventsPage from "@/pages/Events"
import ProjectsPage from "@/pages/Projects"
import MorePages from "@/pages/More"

function PagesRouter({
  page,
  onJoinClick,
}: {
  page: string
  onJoinClick: () => void
}) {
  if (page === "Join the Community" || page === "Membership Guidelines") {
    return <RegistrationPage page={page} onJoinClick={onJoinClick} />
  }
  if (page === "Latest News" || page === "Announcements") {
    return <NewsPage page={page} />
  }
  if (page === "Upcoming Events" || page === "Event Calendar") {
    return <EventsPage page={page} />
  }
  if (page === "Community Projects" || page === "Upload Project") {
    return <ProjectsPage page={page} />
  }
  return <MorePages page={page} />
}

export default PagesRouter
