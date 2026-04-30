const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export function isAllowedImageMimeType(mimeType) {
  return ALLOWED_MIME_TYPES.has(mimeType);
}

function hasPngSignature(buffer) {
  return buffer.length >= 8
    && buffer[0] === 0x89
    && buffer[1] === 0x50
    && buffer[2] === 0x4e
    && buffer[3] === 0x47
    && buffer[4] === 0x0d
    && buffer[5] === 0x0a
    && buffer[6] === 0x1a
    && buffer[7] === 0x0a;
}

function hasJpegSignature(buffer) {
  return buffer.length >= 3
    && buffer[0] === 0xff
    && buffer[1] === 0xd8
    && buffer[2] === 0xff;
}

function hasWebpSignature(buffer) {
  return buffer.length >= 12
    && buffer.subarray(0, 4).toString('ascii') === 'RIFF'
    && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
}

function signatureMatchesMimeType(file) {
  if (file.mimetype === 'image/png') {
    return hasPngSignature(file.buffer);
  }

  if (file.mimetype === 'image/jpeg') {
    return hasJpegSignature(file.buffer);
  }

  if (file.mimetype === 'image/webp') {
    return hasWebpSignature(file.buffer);
  }

  return false;
}

export function validateUploadedImage(file) {
  if (!file) {
    return {
      ok: false,
      status: 400,
      code: 'INVALID_UPLOAD',
      message: 'Upload an image file.'
    };
  }

  if (!file.size || file.size <= 0 || !file.buffer || file.buffer.length === 0) {
    return {
      ok: false,
      status: 400,
      code: 'INVALID_UPLOAD',
      message: 'The uploaded image is empty.'
    };
  }

  if (!isAllowedImageMimeType(file.mimetype)) {
    return {
      ok: false,
      status: 400,
      code: 'INVALID_UPLOAD',
      message: 'Upload a JPEG, PNG, or WebP image.'
    };
  }

  if (!signatureMatchesMimeType(file)) {
    return {
      ok: false,
      status: 400,
      code: 'INVALID_UPLOAD',
      message: 'The uploaded file does not match its image type.'
    };
  }

  return { ok: true };
}
