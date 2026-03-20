/**
 * Image compression and Supabase Storage upload utilities
 * Uses canvas API for client-side compression — no npm dependencies
 */
import { supabase } from './supabase.js'

const STORAGE_BUCKET = 'link-images'

/**
 * Compress an image file using canvas
 * @param {File} file - Image file from <input type="file">
 * @param {Object} options
 * @param {number} [options.maxWidth=800] - Max output width in px
 * @param {number} [options.maxHeight=800] - Max output height in px
 * @param {number} [options.quality=0.8] - Compression quality 0-1
 * @returns {Promise<{blob: Blob, mimeType: string, extension: string}>}
 */
export async function compressImage(file, options = {}) {
  const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB raw file limit
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File is too large. Maximum size is 20MB.')
  }

  const { maxWidth = 800, maxHeight = 800, quality = 0.8 } = options

  // Load image
  const img = new Image()
  const objectUrl = URL.createObjectURL(file)

  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = objectUrl
  })

  URL.revokeObjectURL(objectUrl)

  // Calculate scaled dimensions preserving aspect ratio
  let { width, height } = img
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height)
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)
  }

  // Draw to canvas
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)

  // Try WebP first, fall back to JPEG (Safari < 16 doesn't support WebP encoding)
  let blob = await canvasToBlob(canvas, 'image/webp', quality)
  if (blob && blob.size > 0) {
    return { blob, mimeType: 'image/webp', extension: 'webp' }
  }

  blob = await canvasToBlob(canvas, 'image/jpeg', quality)
  if (!blob || blob.size === 0) {
    throw new Error('Failed to compress image')
  }
  return { blob, mimeType: 'image/jpeg', extension: 'jpg' }
}

/**
 * Upload a blob to Supabase Storage
 * @param {Blob} blob - Image blob
 * @param {string} path - Storage path e.g. "links/userId/uuid.webp"
 * @param {string} mimeType - e.g. "image/webp"
 * @returns {Promise<string>} Public URL of uploaded image
 */
export async function uploadImage(blob, path, mimeType) {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, blob, { contentType: mimeType, upsert: false })

  if (error) throw new Error(`Upload failed: ${error.message}`)

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path)

  return data.publicUrl
}

/**
 * Generate a unique storage path
 * @param {'links'|'profiles'|'backgrounds'} category
 * @param {string} userId
 * @param {string} extension - 'webp' or 'jpg'
 * @returns {string}
 */
export function generateStoragePath(category, userId, extension) {
  // User ID first so RLS policy (foldername[1] = auth.uid) works
  return `${userId}/${category}/${crypto.randomUUID()}-${Date.now()}.${extension}`
}

/**
 * Compress and upload an image file in one step
 * @param {File} file - Image file
 * @param {'links'|'profiles'|'backgrounds'} category
 * @param {string} userId
 * @param {Object} [compressOptions] - Options for compressImage
 * @returns {Promise<string>} Public URL
 */
export async function compressAndUpload(file, category, userId, compressOptions = {}) {
  const { blob, mimeType, extension } = await compressImage(file, compressOptions)
  const path = generateStoragePath(category, userId, extension)
  return uploadImage(blob, path, mimeType)
}

/**
 * List all images uploaded by a user across all categories
 * @param {string} userId
 * @returns {Promise<Array<{url: string, name: string, category: string, created_at: string}>>}
 */
export async function listUserImages(userId) {
  const categories = ['links', 'profiles', 'backgrounds']
  const results = []

  await Promise.all(categories.map(async (category) => {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(`${userId}/${category}`, { sortBy: { column: 'created_at', order: 'desc' } })

      if (error || !data) return

      for (const file of data) {
        if (!file.name || file.name === '.emptyFolderPlaceholder') continue
        const path = `${userId}/${category}/${file.name}`
        const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
        results.push({
          url: urlData.publicUrl,
          name: file.name,
          category,
          created_at: file.created_at || '',
        })
      }
    } catch {
      // Skip category on error
    }
  }))

  // Sort newest first
  results.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
  return results
}

/**
 * Delete all images uploaded by a user (for account deletion)
 * @param {string} userId
 * @returns {Promise<number>} Number of files deleted
 */
export async function deleteUserImages(userId) {
  const categories = ['links', 'profiles', 'backgrounds']
  let deletedCount = 0

  for (const category of categories) {
    try {
      const { data: files, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(`${userId}/${category}`)

      if (error || !files || files.length === 0) continue

      const paths = files
        .filter(f => f.name && f.name !== '.emptyFolderPlaceholder')
        .map(f => `${userId}/${category}/${f.name}`)

      if (paths.length > 0) {
        const { error: delError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove(paths)

        if (!delError) deletedCount += paths.length
      }
    } catch {
      // Continue with other categories
    }
  }

  return deletedCount
}

// ── Internal helpers ──

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), mimeType, quality)
  })
}
