// Edge Function: Validate File Upload
// This function validates uploaded files server-side before they're stored
// Addresses HIGH PRIORITY security issue: Server-Side File Validation

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// File type magic numbers (first bytes of file)
const MAGIC_NUMBERS: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]], // GIF87a or GIF89a
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF header (WebP starts with RIFF)
};

// Allowed file types and sizes
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_ASSET_SIZE = 10 * 1024 * 1024; // 10MB for assets

interface FileValidationResult {
  valid: boolean;
  error?: string;
  detectedType?: string;
}

/**
 * Validate file magic numbers to detect actual file type
 */
function validateMagicNumbers(fileBytes: Uint8Array, declaredMimeType: string): FileValidationResult {
  if (fileBytes.length < 8) {
    return { valid: false, error: 'File too small to validate' };
  }

  // Get magic number patterns for declared type
  const patterns = MAGIC_NUMBERS[declaredMimeType];
  if (!patterns) {
    return { valid: false, error: `Unsupported file type: ${declaredMimeType}` };
  }

  // Check if file matches any pattern for declared type
  for (const pattern of patterns) {
    let matches = true;
    for (let i = 0; i < pattern.length; i++) {
      if (fileBytes[i] !== pattern[i]) {
        matches = false;
        break;
      }
    }
    if (matches) {
      return { valid: true, detectedType: declaredMimeType };
    }
  }

  // File doesn't match declared type - try to detect actual type
  for (const [mimeType, patterns] of Object.entries(MAGIC_NUMBERS)) {
    for (const pattern of patterns) {
      let matches = true;
      for (let i = 0; i < pattern.length && i < fileBytes.length; i++) {
        if (fileBytes[i] !== pattern[i]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        return {
          valid: false,
          error: `File type mismatch: declared ${declaredMimeType}, actual ${mimeType}`,
          detectedType: mimeType,
        };
      }
    }
  }

  return { valid: false, error: 'Unknown file type or invalid file' };
}

/**
 * Validate file dimensions (for images)
 */
async function validateImageDimensions(fileBytes: Uint8Array): Promise<{ valid: boolean; error?: string; width?: number; height?: number }> {
  try {
    // For basic validation, we'll check file size and structure
    // Full dimension validation would require image decoding (can be added if needed)
    
    // PNG: Check for valid PNG structure
    if (fileBytes[0] === 0x89 && fileBytes[1] === 0x50) {
      // PNG files have width/height in bytes 16-23
      if (fileBytes.length >= 24) {
        const width = (fileBytes[16] << 24) | (fileBytes[17] << 16) | (fileBytes[18] << 8) | fileBytes[19];
        const height = (fileBytes[20] << 24) | (fileBytes[21] << 16) | (fileBytes[22] << 8) | fileBytes[23];
        
        // Validate reasonable dimensions (prevent DoS via huge images)
        if (width > 10000 || height > 10000) {
          return { valid: false, error: 'Image dimensions too large (max 10000x10000)' };
        }
        
        return { valid: true, width, height };
      }
    }
    
    // JPEG: More complex structure, basic validation
    if (fileBytes[0] === 0xFF && fileBytes[1] === 0xD8) {
      // JPEG files can have variable structure, basic size check is sufficient
      return { valid: true };
    }
    
    // GIF: Check structure
    if ((fileBytes[0] === 0x47 && fileBytes[1] === 0x49 && fileBytes[2] === 0x46)) {
      // GIF files have width/height in bytes 6-9
      if (fileBytes.length >= 10) {
        const width = fileBytes[6] | (fileBytes[7] << 8);
        const height = fileBytes[8] | (fileBytes[9] << 8);
        
        if (width > 10000 || height > 10000) {
          return { valid: false, error: 'Image dimensions too large (max 10000x10000)' };
        }
        
        return { valid: true, width, height };
      }
    }
    
    return { valid: true }; // Basic validation passed
  } catch (error) {
    return { valid: false, error: `Error validating image: ${error.message}` };
  }
}

serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      });
    }

    // Only allow POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const bucketId = formData.get('bucketId') as string;
    const fileName = formData.get('fileName') as string;

    if (!file || !bucketId || !fileName) {
      return new Response(JSON.stringify({ error: 'Missing required fields: file, bucketId, fileName' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate file size
    const maxSize = bucketId === 'assets' ? MAX_ASSET_SIZE : MAX_FILE_SIZE;
    if (file.size > maxSize) {
      return new Response(JSON.stringify({ 
        error: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate file type
    const mimeType = file.type || 'application/octet-stream';
    if (!ALLOWED_TYPES.includes(mimeType)) {
      return new Response(JSON.stringify({ 
        error: `File type not allowed. Allowed types: ${ALLOWED_TYPES.join(', ')}` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate file extension
    const fileExt = fileName.toLowerCase().split('.').pop();
    const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!fileExt || !allowedExts.includes(fileExt)) {
      return new Response(JSON.stringify({ 
        error: `File extension not allowed. Allowed extensions: ${allowedExts.join(', ')}` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Read file bytes for magic number validation
    const fileBytes = new Uint8Array(await file.arrayBuffer());

    // Validate magic numbers (prevent file type spoofing)
    const magicValidation = validateMagicNumbers(fileBytes, mimeType);
    if (!magicValidation.valid) {
      return new Response(JSON.stringify({ 
        error: `File validation failed: ${magicValidation.error}` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate image dimensions (prevent DoS via huge images)
    const dimensionValidation = await validateImageDimensions(fileBytes);
    if (!dimensionValidation.valid) {
      return new Response(JSON.stringify({ 
        error: dimensionValidation.error || 'Invalid image dimensions' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // File passed all validations - return success
    return new Response(JSON.stringify({ 
      valid: true,
      message: 'File validation passed',
      fileSize: file.size,
      mimeType: mimeType,
      detectedType: magicValidation.detectedType,
      dimensions: dimensionValidation.width && dimensionValidation.height 
        ? { width: dimensionValidation.width, height: dimensionValidation.height }
        : undefined,
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('File validation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

