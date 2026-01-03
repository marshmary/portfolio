'use client'
import { motion } from 'motion/react'
import { XIcon } from 'lucide-react'
import { Spotlight } from '@/components/ui/spotlight'
import { Magnetic } from '@/components/ui/magnetic'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { ProjectCard } from '@/components/ui/project-card'
import { ExperienceCard } from '@/components/ui/experience-card'
import { SkillCard } from '@/components/ui/skill-card'
import {
  PROJECTS,
  WORK_EXPERIENCE,
  EDUCATIONS,
  DEVOPS_SKILLS,
  DEV_SKILLS,
  EMAIL,
  SOCIAL_LINKS,
  CERTIFICATIONS,
  PROFILE,
} from './data'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.3,
}

type ProjectVideoProps = {
  src: string
}

function ProjectVideo({ src }: ProjectVideoProps) {
  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.3,
      }}
    >
      <MorphingDialogTrigger>
        <video
          src={src}
          autoPlay
          loop
          muted
          className="aspect-video w-full cursor-zoom-in rounded-xl"
        />
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative aspect-video rounded-2xl bg-zinc-50 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950 dark:ring-zinc-800/50">
          <video
            src={src}
            autoPlay
            loop
            muted
            className="aspect-video h-[50vh] w-full rounded-xl md:h-[70vh]"
          />
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}

function MagneticSocialLink({
  children,
  link,
}: {
  children: React.ReactNode
  link: string
}) {
  return (
    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
      <a
        href={link}
        className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        {children}
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
        >
          <path
            d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </a>
    </Magnetic>
  )
}

export default function Personal() {
  return (
    <motion.main
      className="space-y-24"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="flex-1" id="about">
          <div className="space-y-4">
            {/* Name and Role */}
            <div>
              <h1 className="text-3xl font-medium text-black dark:text-white">
                {PROFILE.displayName || PROFILE.name}
              </h1>
              <p className="text-base text-zinc-600 dark:text-zinc-500">
                {PROFILE.title}
              </p>
            </div>

            {/* Tagline */}
            {PROFILE.tagline && (
              <p className="text-sm font-medium text-zinc-500 italic dark:text-zinc-500">
                &ldquo;{PROFILE.tagline}&rdquo;
              </p>
            )}

            {/* About Text */}
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              {PROFILE.about}
            </p>

            {/* Location and Phone */}
            <div className="flex flex-wrap items-center gap-4 text-base text-zinc-500 dark:text-zinc-400">
              {PROFILE.location && (
                <span className="flex items-center gap-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {PROFILE.location}
                </span>
              )}
              {PROFILE.phone && (
                <span className="flex items-center gap-1">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {PROFILE.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-xl font-medium" id="work">
          Work Experiences
        </h3>
        <div className="flex flex-col space-y-2">
          {WORK_EXPERIENCE.map((job, index) => (
            <ExperienceCard
              key={job.id}
              experience={job}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-3 text-xl font-medium" id="skills">
          Cloud Native DevOps Skills
        </h3>
        <div className="flex flex-col space-y-0">
          <AnimatedBackground
            enableHover
            className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.2,
            }}
          >
            {DEVOPS_SKILLS.map((skill) => (
              <SkillCard key={skill.uid} skill={skill} data-id={skill.uid} />
            ))}
          </AnimatedBackground>
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-3 text-xl font-medium">Development Skills</h3>
        <div className="flex flex-col space-y-0">
          <AnimatedBackground
            enableHover
            className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.2,
            }}
          >
            {DEV_SKILLS.map((skill) => (
              <SkillCard key={skill.uid} skill={skill} data-id={skill.uid} />
            ))}
          </AnimatedBackground>
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-xl font-medium" id="education">
          Education
        </h3>
        <div className="flex flex-col space-y-2">
          {EDUCATIONS.map((school) => (
            <a
              className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30"
              href={school.link}
              target="_blank"
              rel="noopener noreferrer"
              key={school.id}
            >
              <Spotlight
                className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
                size={64}
              />
              <div className="relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950">
                <div className="relative flex w-full flex-row justify-between">
                  <div>
                    <h4 className="font-normal dark:text-zinc-100">
                      {school.title}
                    </h4>
                    <p className="text-zinc-500 dark:text-zinc-400">
                      {school.school}
                    </p>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {school.start} - {school.end}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </motion.section>

      {CERTIFICATIONS.length > 0 && (
        <motion.section
          variants={VARIANTS_SECTION}
          transition={TRANSITION_SECTION}
        >
          <h3 className="mb-5 text-xl font-medium" id="certifications">
            Certifications
          </h3>
          <div className="flex flex-col space-y-2">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.id}
                className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30"
              >
                <Spotlight
                  className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
                  size={64}
                />
                <div className="relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950">
                  <div className="flex w-full flex-row justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold dark:text-zinc-100">
                        {cert.name}
                      </h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {cert.issuer}
                      </p>
                      {cert.description && (
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                          {cert.description}
                        </p>
                      )}
                      {cert.skills && cert.skills.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {cert.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex flex-col items-end justify-between">
                      {cert.icon && (
                        <span className="text-2xl font-bold text-zinc-400 dark:text-zinc-600">
                          {cert.icon === 'AWS' && '☁️'}
                        </span>
                      )}
                      {cert.issueDate && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {cert.issueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-xl font-medium" id="projects">
          Projects
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              renderVideo={(src) => <ProjectVideo src={src} />}
            />
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-xl font-medium" id="contact">
          Connect
        </h3>
        <p className="mb-5 text-base text-zinc-600 dark:text-zinc-400">
          Feel free to contact me at{' '}
          <a className="underline dark:text-zinc-300" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          {PROFILE.phone && (
            <>
              {' '}
              or call{' '}
              <a
                className="underline dark:text-zinc-300"
                href={`tel:${PROFILE.phone.replace(/\s/g, '')}`}
              >
                {PROFILE.phone}
              </a>
            </>
          )}
        </p>
        <div className="flex items-center justify-start space-x-3">
          {SOCIAL_LINKS.map((link) => (
            <MagneticSocialLink key={link.label} link={link.link}>
              {link.label}
            </MagneticSocialLink>
          ))}
        </div>
      </motion.section>
    </motion.main>
  )
}
