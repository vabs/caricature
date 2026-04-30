import { describe, expect, test } from 'vitest';

import { loadConfig } from '../src/config.js';

describe('loadConfig', () => {
  test('uses documented defaults when optional env vars are not set', () => {
    const config = loadConfig({});

    expect(config.port).toBe(3000);
    expect(config.openAIImageModel).toBe('gpt-image-1.5');
    expect(config.maxUploadBytes).toBe(10 * 1024 * 1024);
  });

  test('parses numeric env vars and preserves API key', () => {
    const config = loadConfig({
      OPENAI_API_KEY: 'test-key',
      OPENAI_IMAGE_MODEL: 'custom-image-model',
      PORT: '4321',
      MAX_UPLOAD_MB: '2'
    });

    expect(config.openAIAPIKey).toBe('test-key');
    expect(config.openAIImageModel).toBe('custom-image-model');
    expect(config.port).toBe(4321);
    expect(config.maxUploadBytes).toBe(2 * 1024 * 1024);
  });

  test('rejects invalid numeric limits', () => {
    expect(() => loadConfig({ MAX_UPLOAD_MB: '0' })).toThrow(/MAX_UPLOAD_MB/);
    expect(() => loadConfig({ PORT: 'not-a-port' })).toThrow(/PORT/);
  });
});
