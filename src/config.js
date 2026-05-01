const DEFAULT_PORT = 3000;
const DEFAULT_MAX_UPLOAD_MB = 10;
const DEFAULT_IMAGE_MODEL = 'gpt-image-1.5';
const DEFAULT_GOOGLE_IMAGE_MODEL = 'gemini-2.5-flash-image';
const SUPPORTED_IMAGE_PROVIDERS = new Set(['openai', 'google']);

function parsePositiveInteger(value, name) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed <= 0 || String(parsed) !== String(value).trim()) {
    throw new Error(`${name} must be a positive integer.`);
  }

  return parsed;
}

export function loadConfig(env = process.env) {
  const port = env.PORT ? parsePositiveInteger(env.PORT, 'PORT') : DEFAULT_PORT;
  const maxUploadMb = env.MAX_UPLOAD_MB
    ? parsePositiveInteger(env.MAX_UPLOAD_MB, 'MAX_UPLOAD_MB')
    : DEFAULT_MAX_UPLOAD_MB;
  const imageProvider = env.IMAGE_PROVIDER || 'google';

  if (!SUPPORTED_IMAGE_PROVIDERS.has(imageProvider)) {
    throw new Error('IMAGE_PROVIDER must be either "openai" or "google".');
  }

  return {
    port,
    imageProvider,
    openAIAPIKey: env.OPENAI_API_KEY ?? '',
    openAIImageModel: env.OPENAI_IMAGE_MODEL || DEFAULT_IMAGE_MODEL,
    googleAPIKey: env.GOOGLE_API_KEY || env.GEMINI_API_KEY || '',
    googleImageModel: env.GOOGLE_IMAGE_MODEL || DEFAULT_GOOGLE_IMAGE_MODEL,
    maxUploadBytes: maxUploadMb * 1024 * 1024
  };
}
