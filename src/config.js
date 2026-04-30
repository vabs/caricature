const DEFAULT_PORT = 3000;
const DEFAULT_MAX_UPLOAD_MB = 10;
const DEFAULT_IMAGE_MODEL = 'gpt-image-1.5';

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

  return {
    port,
    openAIAPIKey: env.OPENAI_API_KEY ?? '',
    openAIImageModel: env.OPENAI_IMAGE_MODEL || DEFAULT_IMAGE_MODEL,
    maxUploadBytes: maxUploadMb * 1024 * 1024
  };
}
