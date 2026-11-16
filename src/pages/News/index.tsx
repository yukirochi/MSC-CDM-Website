import AnnouncementsPage from "@/pages/News/AnnouncementsPage"
import LatestNewsPage from "@/pages/News/LatestNewsPage"

function NewsPage({ page }: { page: string }) {
  if (page === "Announcements") return <AnnouncementsPage />
  return <LatestNewsPage />
}

export default NewsPage
