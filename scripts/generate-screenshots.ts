import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECTS_DIR = path.join(__dirname, '../content/projects')
const IMAGES_DIR = path.join(__dirname, '../public/images/projects')

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true })
}

// Read all project files
const projectsPath = path.join(PROJECTS_DIR)
const projectFiles = fs
  .readdirSync(projectsPath)
  .filter((file) => file.endsWith('.json'))

interface Project {
  id: string
  name: string
  link: string
  images?: string[]
}

// Download image helper
function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(filepath)

    protocol
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          // Handle redirect
          file.close()
          fs.unlinkSync(filepath)
          downloadImage(response.headers.location!, filepath)
            .then(resolve)
            .catch(reject)
          return
        }

        if (response.statusCode !== 200) {
          file.close()
          fs.unlinkSync(filepath)
          reject(new Error(`Failed to download: ${response.statusCode}`))
          return
        }

        response.pipe(file)

        file.on('finish', () => {
          file.close()
          resolve()
        })

        file.on('error', (err) => {
          file.close()
          fs.unlinkSync(filepath)
          reject(err)
        })
      })
      .on('error', (err) => {
        file.close()
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath)
        }
        reject(err)
      })
  })
}

// Generate screenshot URL using thum.io
function generateScreenshotUrl(projectUrl: string): string {
  const url = new URL(projectUrl)
  return `https://image.thum.io/get/width/1200/crop/800/600/${url.href}`
}

async function processProject(projectFile: string, force: boolean = false) {
  const filePath = path.join(projectsPath, projectFile)
  const content = fs.readFileSync(filePath, 'utf-8')
  const project: Project = JSON.parse(content)

  // Skip if no link
  if (!project.link) {
    console.log(`⏭️  Skipping ${project.name} - no link provided`)
    return
  }

  // Skip if images already exist and not forcing
  if (!force && project.images && project.images.length > 0) {
    console.log(`⏭️  Skipping ${project.name} - images already exist`)
    return
  }

  const screenshotUrl = generateScreenshotUrl(project.link)
  const imageName = `${project.id}.jpg`
  const imagePath = path.join(IMAGES_DIR, imageName)
  const publicPath = `/images/projects/${imageName}`

  console.log(`📸 Generating screenshot for ${project.name}...`)
  console.log(`   URL: ${screenshotUrl}`)

  try {
    await downloadImage(screenshotUrl, imagePath)
    console.log(`✅ Downloaded: ${publicPath}`)

    // Update project JSON with image path
    project.images = [publicPath]
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2) + '\n', 'utf-8')
    console.log(`✅ Updated ${projectFile}`)
  } catch (error) {
    console.error(
      `❌ Failed to download screenshot for ${project.name}:`,
      error,
    )
  }
}

async function main() {
  const args = process.argv.slice(2)
  const force = args.includes('--force') || args.includes('-f')

  if (force) {
    console.log('🔄 Force mode enabled - regenerating all screenshots\n')
  } else {
    console.log('🚀 Starting screenshot generation...\n')
  }

  for (const projectFile of projectFiles) {
    await processProject(projectFile, force)
    console.log() // Empty line for readability
  }

  console.log('✨ Screenshot generation complete!')
  console.log(
    '💡 Run "npm run optimize-images" to convert to WebP for better compression',
  )
}

main().catch(console.error)
