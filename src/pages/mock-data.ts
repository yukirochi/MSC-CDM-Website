import {
  Code2,
  FolderKanban,
  Lightbulb,
  type LucideIcon,
} from "lucide-react"

export const updates = [
  {
    type: "News",
    date: "November 12, 2026",
    title: "Student teams share their first project prototypes",
    description:
      "Members wrapped up a four-week build sprint with demos spanning campus life, accessibility, and creative tools.",
    tag: "Community story",
  },
  {
    type: "Announcement",
    date: "November 8, 2026",
    title: "Applications are open for the student organizer team",
    description:
      "Help plan workshops, welcome new members, and shape the next semester of community events.",
    tag: "Get involved",
  },
  {
    type: "News",
    date: "October 29, 2026",
    title: "A practical introduction to responsible AI",
    description:
      "Our latest learning session paired short demos with an open conversation about building thoughtfully.",
    tag: "Workshop recap",
  },
  {
    type: "Announcement",
    date: "October 20, 2026",
    title: "Community project showcase: save your spot",
    description:
      "Join us for an informal evening of student demos, feedback, and new project connections.",
    tag: "Event update",
  },
]

export const events = [
  {
    id: "design-night",
    day: "19",
    month: "NOV",
    date: "Thursday, November 19",
    time: "4:00–5:30 PM",
    title: "Design Your First App",
    type: "Hands-on workshop",
    location: "Innovation Lab · Room 204",
    description:
      "Sketch an idea, map a simple user flow, and get feedback from fellow students.",
  },
  {
    id: "project-social",
    day: "24",
    month: "NOV",
    date: "Tuesday, November 24",
    time: "5:00–6:30 PM",
    title: "Project Match-Up Social",
    type: "Community meetup",
    location: "Student Commons",
    description:
      "Share what you would like to build and meet people who want to build it with you.",
  },
  {
    id: "ai-lab",
    day: "03",
    month: "DEC",
    date: "Thursday, December 3",
    time: "3:30–5:00 PM",
    title: "AI Ideas Lab",
    type: "Workshop",
    location: "Innovation Lab · Room 204",
    description:
      "Explore small, useful AI prototypes and discuss how to make them responsible.",
  },
]

export const projects = [
  {
    title: "Campus Connect",
    category: "Web",
    status: "Looking for teammates",
    description:
      "A student-made hub for finding study groups, campus events, and shared interests.",
    initials: "CC",
  },
  {
    title: "Green Steps",
    category: "Social impact",
    status: "In progress",
    description:
      "A friendly challenge that helps classmates discover small, sustainable habits.",
    initials: "GS",
  },
  {
    title: "Study Buddy",
    category: "AI & data",
    status: "Prototype",
    description:
      "An experiment in turning class notes into collaborative study prompts.",
    initials: "SB",
  },
  {
    title: "Made at CDM",
    category: "Creative",
    status: "Looking for teammates",
    description:
      "A digital gallery celebrating the creative work happening across campus.",
    initials: "MC",
  },
]

export const resources: {
  title: string
  category: string
  description: string
  icon: LucideIcon
}[] = [
  {
    title: "Start building for the web",
    category: "Web development",
    description: "A beginner-friendly path from your first HTML page to an interactive site.",
    icon: Code2,
  },
  {
    title: "Design thinking toolkit",
    category: "Product design",
    description: "Prompts for understanding a problem, sketching ideas, and testing early.",
    icon: Lightbulb,
  },
  {
    title: "Your first project plan",
    category: "Getting started",
    description: "A lightweight guide to choosing a scope and making a first milestone.",
    icon: FolderKanban,
  },
]

export const faqs = [
  {
    question: "Who can join the community?",
    answer:
      "Students at CDM who are curious about technology, creativity, or community projects are welcome. You do not need prior experience.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "Not at all. Events and projects include different roles, and members are happy to learn together.",
  },
  {
    question: "Are events free to attend?",
    answer:
      "The sample events shown here are free for students. Event details on the live site will include any specific requirements.",
  },
  {
    question: "Can I suggest an event or project?",
    answer:
      "Absolutely. Send the team a message or share your idea at a community meetup.",
  },
  {
    question: "How do I hear about what is next?",
    answer:
      "Join the community and keep an eye on announcements and the event calendar for upcoming activities.",
  },
]
