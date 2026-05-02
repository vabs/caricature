import { describe, expect, test, vi } from 'vitest';
import request from 'supertest';

import { createApp } from '../src/app.js';

const pngBuffer = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00
]);

function makeApp(overrides = {}) {
  const provider = overrides.provider ?? {
    generateCaricature: vi.fn().mockResolvedValue({
      imageBase64: 'generated',
      mimeType: 'image/png'
    })
  };

  return {
    provider,
    app: createApp({
      provider,
      providers: overrides.providers,
      config: {
        imageProvider: overrides.imageProvider ?? 'openai',
        maxUploadBytes: overrides.maxUploadBytes ?? 1024 * 1024
      },
      rateLimit: overrides.rateLimit ?? { windowMs: 60_000, max: 100 }
    })
  };
}

describe('Express app', () => {
  test('serves health and static UI', async () => {
    const { app } = makeApp();

    await request(app)
      .get('/healthz')
      .expect(200, { ok: true });

    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.text).toContain('Caricature Studio');
    expect(response.text).toContain('choose a generator and style');
  });

  test('returns style and provider catalogs for the UI', async () => {
    const { app } = makeApp();

    await request(app)
      .get('/api/styles')
      .expect(200)
      .expect(({ body }) => {
        expect(body.styles).toHaveLength(10);
        expect(body.styles[0]).toMatchObject({
          id: 'Ink_Wash_Classic',
          label: 'Ink Wash Classic',
          description: expect.stringContaining('Expressive ink outlines')
        });
      });

    await request(app)
      .get('/api/providers')
      .expect(200)
      .expect(({ body }) => {
        expect(body.providers).toEqual([
          expect.objectContaining({ id: 'openai', label: 'OpenAI' }),
          expect.objectContaining({ id: 'google', label: 'Google Gemini' })
        ]);
        expect(body.defaultProvider).toBe('openai');
      });
  });

  test('generates a caricature from an in-memory upload', async () => {
    const { app, provider } = makeApp();

    const response = await request(app)
      .post('/api/caricatures')
      .field('style', 'Ink_Wash_Classic')
      .attach('image', pngBuffer, {
        filename: 'source.png',
        contentType: 'image/png'
      })
      .expect(200);

    expect(response.body).toEqual({
      imageBase64: 'generated',
      mimeType: 'image/png'
    });
    expect(provider.generateCaricature).toHaveBeenCalledWith({
      imageBuffer: pngBuffer,
      mimeType: 'image/png',
      style: 'Ink_Wash_Classic'
    });
  });

  test('generates with the provider selected in the request', async () => {
    const openai = {
      generateCaricature: vi.fn().mockResolvedValue({
        imageBase64: 'openai-generated',
        mimeType: 'image/png'
      })
    };
    const google = {
      generateCaricature: vi.fn().mockResolvedValue({
        imageBase64: 'google-generated',
        mimeType: 'image/png'
      })
    };
    const providers = {
      getProvider: vi.fn((providerId) => ({ openai, google })[providerId])
    };
    const { app } = makeApp({ providers });

    const response = await request(app)
      .post('/api/caricatures')
      .field('provider', 'google')
      .field('style', 'Bold_Vector_Pop')
      .attach('image', pngBuffer, {
        filename: 'source.png',
        contentType: 'image/png'
      })
      .expect(200);

    expect(response.body).toEqual({
      imageBase64: 'google-generated',
      mimeType: 'image/png'
    });
    expect(providers.getProvider).toHaveBeenCalledWith('google');
    expect(openai.generateCaricature).not.toHaveBeenCalled();
    expect(google.generateCaricature).toHaveBeenCalledWith({
      imageBuffer: pngBuffer,
      mimeType: 'image/png',
      style: 'Bold_Vector_Pop'
    });
  });

  test('returns consistent errors for missing files and unsupported styles', async () => {
    const { app } = makeApp();

    await request(app)
      .post('/api/caricatures')
      .field('style', 'Ink_Wash_Classic')
      .expect(400)
      .expect(({ body }) => {
        expect(body).toMatchObject({ error: { code: 'INVALID_UPLOAD' } });
      });

    await request(app)
      .post('/api/caricatures')
      .field('style', 'freeform')
      .attach('image', pngBuffer, {
        filename: 'source.png',
        contentType: 'image/png'
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toMatchObject({ error: { code: 'UNSUPPORTED_STYLE' } });
      });
  });

  test('returns a consistent error for unsupported providers', async () => {
    const { app } = makeApp();

    await request(app)
      .post('/api/caricatures')
      .field('provider', 'other')
      .field('style', 'Ink_Wash_Classic')
      .attach('image', pngBuffer, {
        filename: 'source.png',
        contentType: 'image/png'
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toMatchObject({ error: { code: 'UNSUPPORTED_PROVIDER' } });
      });
  });

  test('returns 413 for uploads over the configured limit', async () => {
    const { app } = makeApp({ maxUploadBytes: 4 });

    await request(app)
      .post('/api/caricatures')
      .field('style', 'Ink_Wash_Classic')
      .attach('image', pngBuffer, {
        filename: 'source.png',
        contentType: 'image/png'
      })
      .expect(413)
      .expect(({ body }) => {
        expect(body).toMatchObject({ error: { code: 'UPLOAD_TOO_LARGE' } });
      });
  });

  test('returns 429 when the rate limit is exceeded', async () => {
    const { app } = makeApp({ rateLimit: { windowMs: 60_000, max: 1 } });

    await request(app)
      .post('/api/caricatures')
      .field('style', 'Ink_Wash_Classic')
      .attach('image', pngBuffer, {
        filename: 'source.png',
        contentType: 'image/png'
      })
      .expect(200);

    await request(app)
      .post('/api/caricatures')
      .field('style', 'Ink_Wash_Classic')
      .attach('image', pngBuffer, {
        filename: 'source.png',
        contentType: 'image/png'
      })
      .expect(429)
      .expect(({ body }) => {
        expect(body).toMatchObject({ error: { code: 'RATE_LIMITED' } });
      });
  });

  test('maps provider failures to 502 without leaking provider details', async () => {
    const { app } = makeApp({
      provider: {
        generateCaricature: vi.fn().mockRejectedValue(new Error('secret upstream detail'))
      }
    });

    await request(app)
      .post('/api/caricatures')
      .field('style', 'Ink_Wash_Classic')
      .attach('image', pngBuffer, {
        filename: 'source.png',
        contentType: 'image/png'
      })
      .expect(502)
      .expect(({ body }) => {
        expect(body).toEqual({
          error: {
            code: 'PROVIDER_ERROR',
            message: 'Unable to generate caricature right now.'
          }
        });
      });
  });
});
