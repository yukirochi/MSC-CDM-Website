import JoinCommunityPage from "@/pages/Registration/JoinCommunityPage"
import MembershipGuidelinesPage from "@/pages/Registration/MembershipGuidelinesPage"

function RegistrationPage({
  page,
  onJoinClick,
}: {
  page: string
  onJoinClick: () => void
}) {
  if (page === "Join the Community") return <JoinCommunityPage />
  return <MembershipGuidelinesPage onJoinClick={onJoinClick} />
}

export default RegistrationPage
