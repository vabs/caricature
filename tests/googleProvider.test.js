import { describe, expect, test, vi } from 'vitest';

import { createGoogleProvider } from '../src/providers/googleProvider.js';

describe('Google image provider', () => {
  test('sends an in-memory upload to Gemini image generation', async () => {
    const generateContent = vi.fn().mockResolvedValue({
      candidates: [{
        content: {
          parts: [{
            inlineData: {
              data: 'generated-base64',
              mimeType: 'image/png'
            }
          }]
        }
      }]
    });

    const provider = createGoogleProvider({
      client: { models: { generateContent } },
      model: 'test-google-model'
    });

    await expect(provider.generateCaricature({
      imageBuffer: Buffer.from('source-image'),
      mimeType: 'image/png',
      style: 'Woodcut_Vintage'
    })).resolves.toEqual({
      imageBase64: 'generated-base64',
      mimeType: 'image/png'
    });

    expect(generateContent).toHaveBeenCalledWith({
      model: 'test-google-model',
      contents: [
        { text: expect.stringContaining('STYLE: Woodcut_Vintage') },
        {
          inlineData: {
            mimeType: 'image/png',
            data: Buffer.from('source-image').toString('base64')
          }
        }
      ]
    });
  });

  test('requires a Google API key when constructing the default client', () => {
    expect(() => createGoogleProvider({
      apiKey: '',
      model: 'test-google-model'
    })).toThrow(/GOOGLE_API_KEY/);
  });

  test('rejects responses without inline image data', async () => {
    const provider = createGoogleProvider({
      client: {
        models: {
          generateContent: vi.fn().mockResolvedValue({
            candidates: [{ content: { parts: [{ text: 'No image generated' }] } }]
          })
        }
      },
      model: 'test-google-model'
    });

    await expect(provider.generateCaricature({
      imageBuffer: Buffer.from('source-image'),
      mimeType: 'image/png',
      style: 'Ink_Wash_Classic'
    })).rejects.toThrow(/Google image response/);
  });
});
