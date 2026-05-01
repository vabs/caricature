import OpenAI, { toFile } from 'openai';

import { buildCaricaturePrompt } from '../caricature/prompt.js';

export { buildCaricaturePrompt } from '../caricature/prompt.js';

function extensionForMimeType(mimeType) {
  if (mimeType === 'image/png') {
    return 'png';
  }

  if (mimeType === 'image/webp') {
    return 'webp';
  }

  return 'jpg';
}

export function createOpenAIProvider({ apiKey, model, client } = {}) {
  const openai = client ?? (() => {
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required for real generation.');
    }

    return new OpenAI({ apiKey });
  })();

  return {
    async generateCaricature({ imageBuffer, mimeType, style }) {
      const image = await toFile(
        imageBuffer,
        `source.${extensionForMimeType(mimeType)}`,
        { type: mimeType }
      );

      const response = await openai.images.edit({
        model,
        image,
        prompt: buildCaricaturePrompt(style),
        size: '1024x1024',
        quality: 'medium',
        output_format: 'png',
        input_fidelity: 'high',
        n: 1
      });

      const imageBase64 = response.data?.[0]?.b64_json;

      if (!imageBase64) {
        throw new Error('OpenAI image response did not include image data.');
      }

      return {
        imageBase64,
        mimeType: 'image/png'
      };
    }
  };
}
