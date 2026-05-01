import { GoogleGenAI } from '@google/genai';

import { buildCaricaturePrompt } from '../caricature/prompt.js';

function findInlineImagePart(response) {
  return response.candidates
    ?.flatMap((candidate) => candidate.content?.parts ?? [])
    .find((part) => part.inlineData?.data);
}

export function createGoogleProvider({ apiKey, model, client } = {}) {
  const google = client ?? (() => {
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY or GEMINI_API_KEY is required for Google generation.');
    }

    return new GoogleGenAI({ apiKey });
  })();

  return {
    async generateCaricature({ imageBuffer, mimeType, style }) {
      const response = await google.models.generateContent({
        model,
        contents: [
          { text: buildCaricaturePrompt(style) },
          {
            inlineData: {
              mimeType,
              data: imageBuffer.toString('base64')
            }
          }
        ]
      });

      const imagePart = findInlineImagePart(response);

      if (!imagePart) {
        throw new Error('Google image response did not include inline image data.');
      }

      return {
        imageBase64: imagePart.inlineData.data,
        mimeType: imagePart.inlineData.mimeType || 'image/png'
      };
    }
  };
}
