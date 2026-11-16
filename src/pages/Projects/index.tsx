import CommunityProjectsPage from "@/pages/Projects/CommunityProjectsPage"
import UploadProjectPage from "@/pages/Projects/UploadProjectPage"

function ProjectsPage({ page }: { page: string }) {
  if (page === "Upload Project") return <UploadProjectPage />
  return <CommunityProjectsPage />
}

export default ProjectsPage
