const styles = [
  {
    id: 'friendly-cartoon',
    label: 'Friendly cartoon',
    description: 'Warm, playful, polished cartoon exaggeration.',
    promptPhrase: 'friendly cartoon caricature'
  },
  {
    id: 'editorial-exaggeration',
    label: 'Editorial exaggeration',
    description: 'Sharp magazine-style exaggeration with confident linework.',
    promptPhrase: 'editorial exaggeration caricature'
  },
  {
    id: 'vintage-comic',
    label: 'Vintage comic',
    description: 'Classic inked comic style with halftone texture.',
    promptPhrase: 'vintage comic caricature'
  },
  {
    id: 'studio-mascot',
    label: 'Studio mascot',
    description: 'Clean mascot-like caricature suitable for profile images.',
    promptPhrase: 'studio mascot caricature'
  }
];

export const STYLE_IDS = styles.map((style) => style.id);

export function listStyles() {
  return styles.map((style) => ({ ...style }));
}

export function getStyle(styleId) {
  return styles.find((style) => style.id === styleId) ?? null;
}
