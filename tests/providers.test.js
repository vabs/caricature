import { describe, expect, test } from 'vitest';

import { createImageProvider } from '../src/providers/index.js';

describe('provider factory', () => {
  test('creates the selected provider', () => {
    const openai = createImageProvider({
      config: {
        imageProvider: 'openai',
        openAIImageModel: 'openai-model'
      },
      clients: {
        openai: { images: { edit() {} } }
      }
    });

    const google = createImageProvider({
      config: {
        imageProvider: 'google',
        googleImageModel: 'google-model'
      },
      clients: {
        google: { models: { generateContent() {} } }
      }
    });

    expect(openai.generateCaricature).toEqual(expect.any(Function));
    expect(google.generateCaricature).toEqual(expect.any(Function));
  });

  test('rejects unsupported providers', () => {
    expect(() => createImageProvider({
      config: { imageProvider: 'other' }
    })).toThrow(/Unsupported image provider/);
  });
});
