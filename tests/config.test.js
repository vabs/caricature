import { describe, expect, test } from 'vitest';

import { loadConfig } from '../src/config.js';

describe('loadConfig', () => {
  test('uses documented defaults when optional env vars are not set', () => {
    const config = loadConfig({});

    expect(config.port).toBe(3000);
    expect(config.imageProvider).toBe('google');
    expect(config.openAIImageModel).toBe('gpt-image-1.5');
    expect(config.googleImageModel).toBe('gemini-2.5-flash-image');
    expect(config.maxUploadBytes).toBe(10 * 1024 * 1024);
  });

  test('parses numeric env vars and preserves API key', () => {
    const config = loadConfig({
      IMAGE_PROVIDER: 'google',
      OPENAI_API_KEY: 'test-key',
      OPENAI_IMAGE_MODEL: 'custom-image-model',
      GOOGLE_API_KEY: 'google-key',
      GOOGLE_IMAGE_MODEL: 'custom-google-model',
      PORT: '4321',
      MAX_UPLOAD_MB: '2'
    });

    expect(config.imageProvider).toBe('google');
    expect(config.openAIAPIKey).toBe('test-key');
    expect(config.openAIImageModel).toBe('custom-image-model');
    expect(config.googleAPIKey).toBe('google-key');
    expect(config.googleImageModel).toBe('custom-google-model');
    expect(config.port).toBe(4321);
    expect(config.maxUploadBytes).toBe(2 * 1024 * 1024);
  });

  test('accepts GEMINI_API_KEY as a fallback for Google credentials', () => {
    const config = loadConfig({ GEMINI_API_KEY: 'gemini-key' });

    expect(config.googleAPIKey).toBe('gemini-key');
  });

  test('rejects invalid numeric limits', () => {
    expect(() => loadConfig({ MAX_UPLOAD_MB: '0' })).toThrow(/MAX_UPLOAD_MB/);
    expect(() => loadConfig({ PORT: 'not-a-port' })).toThrow(/PORT/);
  });

  test('rejects unsupported image providers', () => {
    expect(() => loadConfig({ IMAGE_PROVIDER: 'unknown' })).toThrow(/IMAGE_PROVIDER/);
  });
});
