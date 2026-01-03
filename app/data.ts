/**
 * Portfolio Data
 *
 * ⚠️ AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
 * This file is generated from JSON content in the content/ directory.
 * To update content, edit the JSON files and run: npm run generate-data
 *
 * Generated: 2026-01-03T10:28:27.858Z
 */

// ============================================================================
// TYPES
// ============================================================================

type Project = {
  id: string
  name: string
  description: string
  link: string
  video: string
  longDescription?: string
  technologies?: string[]
  keyFeatures?: string[]
  challenges?: string
  solutions?: string
  duration?: {
    start: string
    end?: string
  }
  teamSize?: number
  role?: string
  githubUrl?: string
  images?: string[]
  metrics?: {
    label: string
    value: string
  }[]
  featured?: boolean
  order?: number
}

type WorkExperience = {
  id: string
  company: string
  title: string
  start: string
  end: string
  link: string
  responsibilities?: string[]
  achievements?: string[]
  technologies?: string[]
  teamSize?: number
  location?: string
  employmentType?: string
  projects?: string[]
  order?: number
}

type Education = {
  id: string
  school: string
  title: string
  start: string
  end: string
  link: string
  description?: string
  gpa?: string
  honors?: string[]
  relevantCourses?: string[]
  order?: number
}

type Skills = {
  uid: string
  title: string
  description: string
  link: string
  proficiencyLevel?: string
  yearsOfExperience?: number
  certifications?: string[]
  relatedProjects?: string[]
  order?: number
}

type SocialLink = {
  label: string
  link: string
  icon?: string
  order?: number
}

type Certification = {
  id: string
  name: string
  issuer: string
  credentialUrl?: string
  credentialId?: string
  issueDate?: string
  expirationDate?: string
  description?: string
  skills?: string[]
  icon?: string
  order?: number
}

type GitHubStats = {
  stars?: number
  repositories?: number
  followers?: number
  following?: number
  contributions?: number
  achievements?: string[]
  topLanguages?: string[]
}

type Profile = {
  name: string
  displayName?: string
  title: string
  tagline?: string
  email: string
  phone?: string
  location?: string
  about: string
  resumeUrl?: string
  avatar?: string
}

// ============================================================================
// DATA
// ============================================================================

export const PROJECTS: Project[] = [
  {
    id: 'avis',
    name: 'Avis',
    description: 'Capstone project: hum to song & song sharing platform.',
    link: 'https://avisapp.netlify.app/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/newProfileItem/d898be8a-7037-4c71-af0c-8997239b050d.mp4?_a=DATAdtAAZAA0',
    longDescription:
      'Avis is a capstone project that allows users to hum a melody and find matching songs. It also features a platform for sharing and discovering music through humming.',
    technologies: ['React', 'Next.js', 'Machine Learning', 'Audio Processing'],
    keyFeatures: [
      'Hum-to-song matching using audio recognition',
      'Song sharing platform',
      'User profile and history',
      'Real-time audio processing',
    ],
    images: ['/images/projects/avis.webp'],
    metrics: [],
    featured: true,
    order: 0,
  },
  {
    id: 'hocsu',
    name: 'Hoc su',
    description: 'A timeline for learning Viet Nam history.',
    link: 'https://hocsu.netlify.app/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/XSfIvT7BUWbPRXhrbLed/ee6871c9-8400-49d2-8be9-e32675eabf7e.mp4?_a=DATAdtAAZAA0',
    longDescription:
      'An interactive timeline application for learning Vietnamese history. The project presents historical events in a visually engaging and chronological format, making history education more accessible and interesting.',
    technologies: ['JavaScript', 'HTML', 'CSS', 'Timeline.js'],
    keyFeatures: [
      'Interactive timeline visualization',
      'Historical events with rich media',
      'Chronological navigation',
      'Responsive design for mobile and desktop',
    ],
    images: ['/images/projects/hocsu.webp'],
    metrics: [],
    featured: true,
    order: 1,
  },
  {
    id: 'draplus',
    name: 'Draplus',
    description:
      'A real-time drawing web application, where people can concurrently sketch and share ideas.',
    link: 'https://draplus.netlify.app/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/XSfIvT7BUWbPRXhrbLed/ee6871c9-8400-49d2-8be9-e32675eabf7e.mp4?_a=DATAdtAAZAA0',
    longDescription:
      'Draplus is a collaborative real-time drawing application that enables multiple users to sketch and brainstorm together. It features a shared canvas where ideas can be visualized and communicated in real-time.',
    technologies: ['React', 'Socket.io', 'Canvas API', 'Node.js', 'WebRTC'],
    keyFeatures: [
      'Real-time collaborative drawing',
      'Multiple users can draw simultaneously',
      'Drawing tools and color palette',
      'Save and export drawings',
      'Instant synchronization across clients',
    ],
    images: ['/images/projects/draplus.webp'],
    metrics: [],
    featured: true,
    order: 2,
  },
  {
    id: 'neru',
    name: 'Neru',
    description: 'Landing page for my favorite Vsinger.',
    link: 'https://neru.netlify.app/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/newProfileItem/d898be8a-7037-4c71-af0c-8997239b050d.mp4?_a=DATAdtAAZAA0',
    longDescription:
      "A beautifully designed landing page dedicated to Neru, a virtual singer (Vsinger). The page showcases Neru's music, artwork, and latest updates with an aesthetic design that reflects the artist's style.",
    technologies: ['HTML', 'CSS', 'JavaScript', 'Animation'],
    keyFeatures: [
      'Responsive landing page design',
      'Smooth animations and transitions',
      'Music player integration',
      'Gallery of artwork',
    ],
    images: ['/images/projects/neru.webp'],
    metrics: [],
    featured: false,
    order: 3,
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    id: 'ptn-global',
    company: 'PTN Global',
    title: 'DevOps Engineer',
    start: '2023',
    end: 'Present',
    link: 'https://www.ptnglobalcorp.com/',
    responsibilities: [
      'Automate infrastructure provisioning using Terraform',
      'Implement and maintain CI/CD pipelines using Jenkins and GitHub Actions',
      'Manage containerized applications with Docker and Kubernetes',
      'Monitor system performance using Grafana, Prometheus, and ELK Stack',
      'Optimize cloud infrastructure costs and performance',
    ],
    achievements: [
      'Reduced deployment time by 60% through automation',
      'Implemented monitoring solution that improved system uptime to 99.9%',
      'Successfully migrated legacy applications to containerized architecture',
    ],
    technologies: [
      'AWS',
      'Terraform',
      'Jenkins',
      'GitHub Actions',
      'Docker',
      'Kubernetes',
      'Grafana',
      'Prometheus',
      'ELK Stack',
    ],
    employmentType: 'Full-time',
    projects: [],
    order: 0,
  },
  {
    id: 'biwoco',
    company: 'Biwoco',
    title: 'Internship Software Engineer',
    start: '06/2022',
    end: '08/2022',
    link: 'https://biwoco.com/',
    responsibilities: [
      'Developed web applications using modern JavaScript frameworks',
      'Collaborated with team members on feature implementation',
      'Participated in code reviews and testing',
      'Learned software development best practices',
    ],
    achievements: [
      'Successfully delivered assigned features on time',
      'Contributed to improving code quality through reviews',
      'Gained hands-on experience with professional development workflows',
    ],
    technologies: ['JavaScript', 'React', 'Node.js', 'Git'],
    employmentType: 'Internship',
    projects: [],
    order: 1,
  },
  {
    id: 'fpt-software',
    company: 'FPT Software',
    title: 'Internship Software Engineer',
    start: '09/2021',
    end: '12/2021',
    link: 'https://fsoft-academy.edu.vn/',
    responsibilities: [
      'Learned software engineering fundamentals',
      'Worked on training projects and assignments',
      'Practiced coding standards and version control',
      'Participated in team collaboration exercises',
    ],
    achievements: [
      'Completed intensive software engineering training program',
      'Developed strong foundation in programming and software design',
      'Successfully completed all assigned projects',
    ],
    technologies: ['C#', '.NET', 'SQL Server', 'Git'],
    employmentType: 'Internship',
    projects: [],
    order: 2,
  },
]

export const EDUCATIONS: Education[] = [
  {
    id: 'fpt-university',
    school: 'FPT University',
    title: 'Bachelor Degree - Software Engineer',
    start: '2019',
    end: '2023',
    link: 'https://daihoc.fpt.edu.vn/',
    description:
      "Bachelor's degree in Software Engineering with focus on modern software development practices, cloud computing, and DevOps methodologies.",
    honors: [],
    relevantCourses: [
      'Data Structures and Algorithms',
      'Object-Oriented Programming',
      'Database Management Systems',
      'Software Engineering',
      'Cloud Computing',
      'DevOps Practices',
      'Web Development',
      'Mobile Development',
    ],
    order: 0,
  },
]

export const DEVOPS_SKILLS: Skills[] = [
  {
    uid: 'devops-cloud',
    title: 'Cloud Computing Platforms',
    description: 'AWS, Digital Pacific, Azure, Firebase',
    link: '',
    proficiencyLevel: 'Advanced',
    certifications: [],
    relatedProjects: [],
    order: 0,
  },
  {
    uid: 'devops-containers',
    title: 'Containerization and Orchestration',
    description: 'Docker, Kubernetes, Helm, Docker Compose',
    link: '',
    proficiencyLevel: 'Advanced',
    certifications: [],
    relatedProjects: [],
    order: 1,
  },
  {
    uid: 'devops-iac',
    title: 'Infrastructure as Code',
    description: 'Terraform, Ansible, CloudFormation',
    link: '',
    proficiencyLevel: 'Advanced',
    certifications: [],
    relatedProjects: [],
    order: 2,
  },
  {
    uid: 'devops-cicd',
    title: 'Continuous Integration and Continuous Deployment (CI/CD)',
    description: 'Jenkins, GitHub Actions, GitLab CI, CircleCI',
    link: '',
    proficiencyLevel: 'Advanced',
    certifications: [],
    relatedProjects: [],
    order: 3,
  },
  {
    uid: 'devops-monitoring',
    title: 'Monitoring, Logging, and Observability',
    description: 'Prometheus, Grafana, ELK Stack, CloudWatch',
    link: '',
    proficiencyLevel: 'Advanced',
    certifications: [],
    relatedProjects: [],
    order: 4,
  },
  {
    uid: 'devops-vcs',
    title: 'Version Control',
    description: 'Git, GitHub, GitLab, Bitbucket',
    link: '',
    proficiencyLevel: 'Advanced',
    certifications: [],
    relatedProjects: [],
    order: 5,
  },
  {
    uid: 'devops-scripting',
    title: 'Scripting',
    description: 'Python, Bash, PowerShell',
    link: '',
    proficiencyLevel: 'Advanced',
    certifications: [],
    relatedProjects: [],
    order: 6,
  },
  {
    uid: 'devops-database',
    title: 'Database',
    description: 'PostgreSQL, MySQL, MongoDB',
    link: '',
    proficiencyLevel: 'Intermediate',
    certifications: [],
    relatedProjects: [],
    order: 7,
  },
  {
    uid: 'devops-web',
    title: 'Web Servers',
    description: 'Nginx, Apache',
    link: '',
    proficiencyLevel: 'Intermediate',
    certifications: [],
    relatedProjects: [],
    order: 8,
  },
]

export const DEV_SKILLS: Skills[] = [
  {
    uid: 'dev-languages',
    title: 'Languages',
    description: 'Python, Groovy, C#, JavaScript, TypeScript',
    link: '',
    proficiencyLevel: 'Advanced',
    certifications: [],
    relatedProjects: [],
    order: 0,
  },
  {
    uid: 'dev-frameworks',
    title: 'Framework',
    description: 'FastAPI, Dotnet, React, NextJS, OpenCart, Vue',
    link: '',
    proficiencyLevel: 'Advanced',
    certifications: [],
    relatedProjects: [],
    order: 1,
  },
  {
    uid: 'dev-tools',
    title: 'Other tools',
    description: 'Git, Jira, Figma.',
    link: '',
    proficiencyLevel: 'Advanced',
    certifications: [],
    relatedProjects: [],
    order: 2,
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/marshmary',
    order: 0,
  },
  {
    label: 'LinkedIn',
    link: 'https://www.linkedin.com/in/phu-tran-thien/',
    order: 1,
  },
]

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'aws-cloud-practitioner',
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    credentialUrl:
      'https://www.credly.com/badges/9313fc7f-d47c-45a9-a564-a89a4001f5a3/public_url',
    credentialId: 'AWS-CP-123456',
    issueDate: '2023',
    description:
      'Foundational understanding of AWS Cloud concepts, security, and architecture.',
    skills: ['AWS Cloud', 'Cloud Computing', 'Security', 'Architecture'],
    icon: 'AWS',
    order: 0,
  },
]

export const GITHUB_STATS: GitHubStats = {}

export const PROFILE: Profile = {
  name: 'Trần Thiện Phú',
  displayName: 'Phu Tran',
  title: 'DevOps Engineer',
  tagline: 'Automate everything. Monitor everything. Improve everything.',
  email: 'contact@phutran.dev',
  phone: '(+84) 763 883 037',
  location: 'Can Tho City, Vietnam',
  about:
    'A passionate DevOps engineer with expertise in automating infrastructure, optimizing deployment pipelines, and enhancing system reliability. Skilled in cloud platforms, CI/CD tools, and containerization, I bridge the gap between development and operations to deliver scalable, efficient, and secure software solutions.',
}

export const EMAIL = 'contact@phutran.dev'
