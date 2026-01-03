/**
 * Image Optimization Script
 *
 * Converts project screenshots to WebP format for better compression.
 * WebP typically provides 25-35% better compression than JPEG.
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const PROJECTS_DIR = path.join(process.cwd(), 'content', 'projects')
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'projects')

// Read all project JSON files
function readProjects() {
  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith('.json'))
  return files.map((file) => {
    const filePath = path.join(PROJECTS_DIR, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  })
}

// Convert JPG to WebP
async function convertToWebP(jpgPath: string, webpPath: string) {
  try {
    await sharp(jpgPath)
      .webp({
        quality: 85,
        effort: 6, // Higher effort for better compression
        nearLossless: true,
      })
      .toFile(webpPath)
    return true
  } catch (error) {
    console.error(`Error converting ${jpgPath}:`, error)
    return false
  }
}

// Main optimization function
async function optimizeImages() {
  console.log('🖼️  Optimizing project images...')

  const projects = readProjects()
  const stats = {
    converted: 0,
    originalSize: 0,
    optimizedSize: 0,
  }

  for (const project of projects) {
    if (!project.images || project.images.length === 0) {
      continue
    }

    const imagePath = project.images[0]
    if (!imagePath.startsWith('/images/projects/')) {
      continue
    }

    const fileName = path.basename(imagePath)
    const jpgPath = path.join(IMAGES_DIR, fileName)

    // Skip if not a JPG file
    if (!fileName.endsWith('.jpg')) {
      continue
    }

    if (!fs.existsSync(jpgPath)) {
      console.log(`⚠️  Image not found: ${jpgPath}`)
      continue
    }

    const webpFileName = fileName.replace('.jpg', '.webp')
    const webpPath = path.join(IMAGES_DIR, webpFileName)

    // Get original size
    const originalStats = fs.statSync(jpgPath)
    stats.originalSize += originalStats.size

    // Convert to WebP
    console.log(`  Converting ${fileName} -> ${webpFileName}`)
    const success = await convertToWebP(jpgPath, webpPath)

    if (success) {
      const webpStats = fs.statSync(webpPath)
      stats.optimizedSize += webpStats.size
      stats.converted++

      // Update project JSON to use WebP
      project.images[0] = `/images/projects/${webpFileName}`
      const projectPath = path.join(PROJECTS_DIR, `${project.id}.json`)
      fs.writeFileSync(
        projectPath,
        JSON.stringify(project, null, 2) + '\n',
        'utf-8',
      )

      const savings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(
        1,
      )
      console.log(
        `    ✅ ${(originalStats.size / 1024).toFixed(1)}KB -> ${(webpStats.size / 1024).toFixed(1)}KB (${savings}% reduction)`,
      )
    }
  }

  console.log('\n✅ Optimization complete!')
  console.log(`   Converted: ${stats.converted} images`)
  console.log(`   Original: ${(stats.originalSize / 1024).toFixed(1)}KB`)
  console.log(`   Optimized: ${(stats.optimizedSize / 1024).toFixed(1)}KB`)
  console.log(
    `   Savings: ${((1 - stats.optimizedSize / stats.originalSize) * 100).toFixed(1)}%`,
  )
}

// Run the optimizer
optimizeImages().catch(console.error)
