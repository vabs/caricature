import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';

import { listStyles, getStyle } from './caricature/styles.js';
import { validateUploadedImage } from './uploads/validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_PUBLIC_DIR = path.join(__dirname, '..', 'public');

function jsonError(response, status, code, message) {
  return response.status(status).json({
    error: {
      code,
      message
    }
  });
}

function createUpload(maxUploadBytes) {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: maxUploadBytes,
      files: 1
    }
  });
}

export function createApp({
  provider,
  config,
  publicDir = DEFAULT_PUBLIC_DIR,
  rateLimit: rateLimitOptions = { windowMs: 60_000, max: 12 }
}) {
  if (!provider?.generateCaricature) {
    throw new Error('A provider with generateCaricature is required.');
  }

  const app = express();
  const upload = createUpload(config.maxUploadBytes);
  const generationLimiter = rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    ...rateLimitOptions,
    handler: (_request, response) => {
      jsonError(response, 429, 'RATE_LIMITED', 'Too many generation requests. Try again later.');
    }
  });

  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));
  app.use(express.static(publicDir));

  app.get('/healthz', (_request, response) => {
    response.json({ ok: true });
  });

  app.get('/api/styles', (_request, response) => {
    response.json({ styles: listStyles() });
  });

  app.post('/api/caricatures', generationLimiter, upload.single('image'), async (request, response, next) => {
    try {
      const uploadValidation = validateUploadedImage(request.file);

      if (!uploadValidation.ok) {
        return jsonError(
          response,
          uploadValidation.status,
          uploadValidation.code,
          uploadValidation.message
        );
      }

      const style = typeof request.body.style === 'string' ? request.body.style : '';

      if (!getStyle(style)) {
        return jsonError(response, 400, 'UNSUPPORTED_STYLE', 'Choose one of the supported caricature styles.');
      }

      const result = await provider.generateCaricature({
        imageBuffer: request.file.buffer,
        mimeType: request.file.mimetype,
        style
      });

      return response.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.use((error, _request, response, next) => {
    if (response.headersSent) {
      return next(error);
    }

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return jsonError(response, 413, 'UPLOAD_TOO_LARGE', 'The uploaded image is too large.');
    }

    return jsonError(response, 502, 'PROVIDER_ERROR', 'Unable to generate caricature right now.');
  });

  return app;
}
