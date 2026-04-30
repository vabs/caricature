import { describe, expect, test, vi } from 'vitest';

import {
  buildCaricaturePrompt,
  createOpenAIProvider
} from '../src/providers/openaiProvider.js';

describe('OpenAI provider', () => {
  test('builds preset-only prompts without user freeform text', () => {
    const prompt = buildCaricaturePrompt('friendly-cartoon');

    expect(prompt).toContain('friendly cartoon caricature');
    expect(prompt).toContain('Do not add text');
    expect(prompt).not.toContain('freeform');
  });

  test('sends an in-memory upload to the image edit endpoint', async () => {
    const edit = vi.fn().mockResolvedValue({
      data: [{ b64_json: 'generated-base64' }]
    });

    const provider = createOpenAIProvider({
      client: { images: { edit } },
      model: 'test-image-model'
    });

    await expect(provider.generateCaricature({
      imageBuffer: Buffer.from([0xff, 0xd8, 0xff]),
      mimeType: 'image/jpeg',
      style: 'studio-mascot'
    })).resolves.toEqual({
      imageBase64: 'generated-base64',
      mimeType: 'image/png'
    });

    expect(edit).toHaveBeenCalledWith(expect.objectContaining({
      model: 'test-image-model',
      prompt: expect.stringContaining('studio mascot caricature'),
      size: '1024x1024',
      quality: 'medium',
      n: 1
    }));
    expect(edit.mock.calls[0][0].image).toBeDefined();
  });

  test('requires an API key when constructing the default OpenAI client', () => {
    expect(() => createOpenAIProvider({
      apiKey: '',
      model: 'test-image-model'
    })).toThrow(/OPENAI_API_KEY/);
  });
});
