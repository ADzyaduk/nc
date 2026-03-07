/**
 * Converts public/tarot/*.png to public/tarot/*.webp (smaller, faster load).
 * Run once: npm run tarot:webp
 * Requires: npm install -D sharp
 */
import { readdir, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public', 'tarot')

async function main() {
  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch {
    console.error('Install sharp first: npm install -D sharp')
    process.exit(1)
  }

  const files = await readdir(publicDir)
  const pngs = files.filter(f => f.endsWith('.png'))

  for (const name of pngs) {
    const src = join(publicDir, name)
    const dest = join(publicDir, name.replace(/\.png$/i, '.webp'))
    await sharp(src)
      .resize(240, 360, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(dest)
    console.log('Created', name.replace('.png', '.webp'))
  }

  console.log('Done. Tarot images now have .webp versions.')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
