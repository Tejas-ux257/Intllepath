const careers = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    domain: "Technology",
    description: "Build web, mobile, and cloud applications using programming, architecture, and testing skills.",
    skills: ["JavaScript", "Python", "Data Structures", "Databases", "Git"],
    roadmap: ["Learn programming basics", "Build frontend and backend projects", "Practice DSA", "Deploy apps", "Prepare a portfolio"]
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    domain: "Data",
    description: "Analyze data and build predictive models for business, research, and product decisions.",
    skills: ["Python", "Statistics", "Machine Learning", "SQL", "Visualization"],
    roadmap: ["Learn Python and statistics", "Study ML algorithms", "Work on datasets", "Create dashboards", "Build model projects"]
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    domain: "Security",
    description: "Protect systems, networks, and data from attacks through monitoring, testing, and secure design.",
    skills: ["Networking", "Linux", "Security Tools", "Risk Analysis", "Incident Response"],
    roadmap: ["Learn networking basics", "Practice Linux", "Study OWASP", "Use SIEM tools", "Earn Security+ or CEH"]
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    domain: "Design",
    description: "Design usable digital products through research, wireframes, visual design, and prototyping.",
    skills: ["Figma", "User Research", "Wireframing", "Visual Design", "Usability Testing"],
    roadmap: ["Learn design principles", "Practice Figma", "Create case studies", "Test with users", "Build portfolio"]
  },
  {
    id: "business-analyst",
    title: "Business Analyst",
    domain: "Management",
    description: "Bridge business needs and technical teams through requirements, analysis, and process improvement.",
    skills: ["Communication", "Excel", "SQL Basics", "Documentation", "Process Mapping"],
    roadmap: ["Learn business analysis basics", "Practice documentation", "Study Agile", "Use analytics tools", "Build case studies"]
  }
];

const courses = [
  { id: "fullstack", careerId: "software-engineer", title: "Full Stack Web Development", provider: "Coursera/Udemy", duration: "4-6 months" },
  { id: "python-ml", careerId: "data-scientist", title: "Python and Machine Learning", provider: "NPTEL/Coursera", duration: "5 months" },
  { id: "security", careerId: "cybersecurity-analyst", title: "Cybersecurity Fundamentals", provider: "Cisco/EC-Council", duration: "3 months" },
  { id: "product-design", careerId: "ui-ux-designer", title: "UI/UX Product Design", provider: "Google/Coursera", duration: "3-4 months" },
  { id: "ba", careerId: "business-analyst", title: "Business Analytics Foundations", provider: "LinkedIn Learning", duration: "2-3 months" }
];

const colleges = [
  { id: "muse", name: "Mysore University School of Engineering", location: "Mysuru", streams: ["Technology", "Data", "Design"] },
  { id: "rvce", name: "RV College of Engineering", location: "Bengaluru", streams: ["Technology", "Data", "Security"] },
  { id: "sjce", name: "JSS Science and Technology University", location: "Mysuru", streams: ["Technology", "Management"] },
  { id: "nift", name: "National Institute of Fashion Technology", location: "Bengaluru", streams: ["Design"] }
];

const scholarships = [
  { id: "ssp", title: "State Scholarship Portal", eligibility: "Karnataka students based on income/category", streams: ["Technology", "Data", "Design", "Security", "Management"] },
  { id: "nsp", title: "National Scholarship Portal", eligibility: "Eligible Indian students under central schemes", streams: ["Technology", "Data", "Security", "Management"] },
  { id: "aiCTE", title: "AICTE Pragati/Saksham", eligibility: "Technical education students meeting AICTE criteria", streams: ["Technology", "Data", "Security"] }
];

module.exports = { careers, courses, colleges, scholarships };
