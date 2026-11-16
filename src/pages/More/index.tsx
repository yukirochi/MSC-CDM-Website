import AboutTheCommunityPage from "@/pages/More/AboutTheCommunityPage"
import ContactUsPage from "@/pages/More/ContactUsPage"
import FrequentlyAskedQuestionsPage from "@/pages/More/FrequentlyAskedQuestionsPage"
import OurTeamPage from "@/pages/More/OurTeamPage"
import ResourcesPage from "@/pages/More/ResourcesPage"

function MorePages({ page }: { page: string }) {
  if (page === "About the Community") return <AboutTheCommunityPage />
  if (page === "Our Team") return <OurTeamPage />
  if (page === "Resources") return <ResourcesPage />
  if (page === "Frequently Asked Questions") return <FrequentlyAskedQuestionsPage />
  return <ContactUsPage />
}

export default MorePages
