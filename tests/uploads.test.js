import { describe, expect, test } from 'vitest';

import {
  isAllowedImageMimeType,
  validateUploadedImage
} from '../src/uploads/validation.js';

const pngBuffer = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00
]);
const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xdb, 0x00]);
const webpBuffer = Buffer.from('RIFFzzzzWEBP', 'ascii');

describe('upload validation', () => {
  test('allows only jpeg, png, and webp mime types', () => {
    expect(isAllowedImageMimeType('image/jpeg')).toBe(true);
    expect(isAllowedImageMimeType('image/png')).toBe(true);
    expect(isAllowedImageMimeType('image/webp')).toBe(true);
    expect(isAllowedImageMimeType('image/gif')).toBe(false);
  });

  test('accepts files whose mime type and signature agree', () => {
    expect(validateUploadedImage({
      buffer: pngBuffer,
      mimetype: 'image/png',
      size: pngBuffer.length
    })).toEqual({ ok: true });

    expect(validateUploadedImage({
      buffer: jpegBuffer,
      mimetype: 'image/jpeg',
      size: jpegBuffer.length
    })).toEqual({ ok: true });

    expect(validateUploadedImage({
      buffer: webpBuffer,
      mimetype: 'image/webp',
      size: webpBuffer.length
    })).toEqual({ ok: true });
  });

  test('rejects missing files, unsupported types, empty files, and mismatched signatures', () => {
    expect(validateUploadedImage(null)).toMatchObject({ ok: false, status: 400 });
    expect(validateUploadedImage({
      buffer: Buffer.from('not an image'),
      mimetype: 'image/gif',
      size: 12
    })).toMatchObject({ ok: false, status: 400 });
    expect(validateUploadedImage({
      buffer: Buffer.alloc(0),
      mimetype: 'image/png',
      size: 0
    })).toMatchObject({ ok: false, status: 400 });
    expect(validateUploadedImage({
      buffer: Buffer.from('not a png'),
      mimetype: 'image/png',
      size: 9
    })).toMatchObject({ ok: false, status: 400 });
  });
});
