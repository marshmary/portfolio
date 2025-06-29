type Project = {
  name: string
  description: string
  link: string
  video: string
  id: string
}

type WorkExperience = {
  company: string
  title: string
  start: string
  end: string
  link: string
  id: string
}

type Education = {
  school: string
  title: string
  start: string
  end: string
  link: string
  id: string
}

type Skills = {
  title: string
  description: string
  link: string
  uid: string
}

type SocialLink = {
  label: string
  link: string
}

export const PROJECTS: Project[] = [
  {
    name: 'Avis',
    description:
      'Capstone project: hum to song & song sharing platform.',
    link: 'https://avisapp.netlify.app/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/newProfileItem/d898be8a-7037-4c71-af0c-8997239b050d.mp4?_a=DATAdtAAZAA0',
    id: 'project1',
  },
  {
    name: 'Hoc su',
    description: 'A timeline for learning Viet Nam history.',
    link: 'https://hocsu.netlify.app/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/XSfIvT7BUWbPRXhrbLed/ee6871c9-8400-49d2-8be9-e32675eabf7e.mp4?_a=DATAdtAAZAA0',
    id: 'project2',
  },
  {
    name: 'Draplus',
    description: 'A real-time drawing web application, where people can concurrently sketch and share ideas.',
    link: 'https://draplus.netlify.app/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/XSfIvT7BUWbPRXhrbLed/ee6871c9-8400-49d2-8be9-e32675eabf7e.mp4?_a=DATAdtAAZAA0',
    id: 'project3',
  },
  {
    name: 'Neru',
    description: 'Landing page for my favorite Vsinger.',
    link: 'https://neru.netlify.app/',
    video:
      'https://res.cloudinary.com/read-cv/video/upload/t_v_b/v1/1/profileItems/W2azTw5BVbMXfj7F53G92hMVIn32/newProfileItem/d898be8a-7037-4c71-af0c-8997239b050d.mp4?_a=DATAdtAAZAA0',
    id: 'project3',
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: 'PTN Global',
    title: 'DevOps Engineer',
    start: '2023',
    end: 'Present',
    link: 'https://www.ptnglobalcorp.com/',
    id: 'work1',
  },
  {
    company: 'Biwoco',
    title: 'Internship Software Engineer',
    start: '06/2022',
    end: '08/2022',
    link: 'https://biwoco.com/',
    id: 'work2',
  },
  {
    company: 'FPT Software',
    title: 'Internship Software Engineer',
    start: '09/2021',
    end: '12/2021',
    link: 'https://fsoft-academy.edu.vn/',
    id: 'work3',
  },
]

export const EDUCATIONS: Education[] = [
  {
    school: 'FPT University',
    title: 'Bachelor Degree - Software Engineer',
    start: '2019',
    end: '2023',
    link: 'https://daihoc.fpt.edu.vn/',
    id: 'school1',
  },
]

export const DEVOPS_SKILLS: Skills[] = [
  {
    title: 'Cloud Computing Platforms',
    description:
      'AWS, Digital Pacific, Azure, Firebase',
    link: '',
    uid: 'blog-1',
  },
  {
    title: 'Provisioning',
    description: 'Terraform',
    link: '',
    uid: 'blog-2',
  },
  {
    title: 'Continuous Integration and Continuous Deployment (CI/CD)',
    description: 'Jenkins, Github Actions',
    link: '',
    uid: 'blog-3',
  },
  {
    title: 'Containerization and Orchestration',
    description: 'Docker, Containerd, Kubernetes',
    link: '',
    uid: 'blog-4',
  },
  {
    title: 'Monitoring, Logging, and Observability',
    description: 'Grafana, Prometheus, Loki, ELK Stack',
    link: '',
    uid: 'blog-5',
  },
  {
    title: 'Database',
    description:
      'MariaDB, Sql Server, MongoDB, MySQL, Redis, DynamoDB',
    link: '',
    uid: 'blog-6',
  },
]

export const DEV_SKILLS: Skills[] = [
  {
    title: 'Languages',
    description: 'Python, Groovy, C#, JavaScript, TypeScript',
    link: '',
    uid: 'blog-10',
  },
  {
    title: 'Framework',
    description:
      'FastAPI, Dotnet, React, NextJS, OpenCart, Vue',
    link: '',
    uid: 'blog-11',
  },
  {
    title: 'Other tools',
    description: 'Git, Jira, Figma.',
    link: '',
    uid: 'blog-12',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Github',
    link: 'https://github.com/marshmary',
  },
  {
    label: 'LinkedIn',
    link: '',
  },
]

export const EMAIL = 'phutt2201@gmail.com'
