import { createGoogleProvider } from './googleProvider.js';
import { createOpenAIProvider } from './openaiProvider.js';

const providerCatalog = [
  {
    id: 'openai',
    label: 'OpenAI',
    description: 'Use OpenAI image editing models.'
  },
  {
    id: 'google',
    label: 'Google Gemini',
    description: 'Use Google Gemini image generation models.'
  }
];

export function listImageProviders() {
  return providerCatalog.map((provider) => ({ ...provider }));
}

export function getImageProviderInfo(providerId) {
  return providerCatalog.find((provider) => provider.id === providerId) ?? null;
}

export function createImageProvider({ config, clients = {} }) {
  if (config.imageProvider === 'openai') {
    return createOpenAIProvider({
      apiKey: config.openAIAPIKey,
      model: config.openAIImageModel,
      client: clients.openai
    });
  }

  if (config.imageProvider === 'google') {
    return createGoogleProvider({
      apiKey: config.googleAPIKey,
      model: config.googleImageModel,
      client: clients.google
    });
  }

  throw new Error(`Unsupported image provider: ${config.imageProvider}`);
}

export function createProviderRegistry({ config, clients = {} }) {
  const cache = new Map();

  return {
    getProvider(providerId = config.imageProvider) {
      if (!getImageProviderInfo(providerId)) {
        throw new Error(`Unsupported image provider: ${providerId}`);
      }

      if (!cache.has(providerId)) {
        cache.set(providerId, createImageProvider({
          config: {
            ...config,
            imageProvider: providerId
          },
          clients
        }));
      }

      return cache.get(providerId);
    }
  };
}
