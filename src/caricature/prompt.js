import { getStyle } from './styles.js';

export function buildCaricaturePrompt(styleId) {
  const style = getStyle(styleId);

  if (!style) {
    throw new Error(`Unsupported caricature style: ${styleId}`);
  }

  return [
    'Create a caricature from the input photo. Keep the person immediately recognizable.',
    `STYLE: ${style.id}`,
    style.description,
    'Preserve the person or subject identity, core facial structure, expression, and recognizable features.',
    'Use tasteful exaggeration without making the result insulting, grotesque, or demeaning.',
    'Keep the composition centered and suitable for a profile image.',
    'Do not add text, captions, logos, watermarks, or extra people.'
  ].join(' ');
}
