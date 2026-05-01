function labelFromStyleName(styleName) {
  return styleName.replaceAll('_', ' ');
}

const styles = [
  {
    id: 'Ink_Wash_Classic',
    label: labelFromStyleName('Ink_Wash_Classic'),
    description: 'Expressive ink outlines with soft grayscale washes, paper texture, elegant brush strokes.'
  },
  {
    id: 'Bold_Vector_Pop',
    label: labelFromStyleName('Bold_Vector_Pop'),
    description: 'Thick clean outlines, flat bold colors, high contrast, poster-like, minimal shading.'
  },
  {
    id: 'Pencil_Sketch_Studio',
    label: labelFromStyleName('Pencil_Sketch_Studio'),
    description: 'Fine graphite lines, cross-hatching, subtle smudges, sketchbook feel.'
  },
  {
    id: 'Charcoal_Drama',
    label: labelFromStyleName('Charcoal_Drama'),
    description: 'Deep blacks, smudged charcoal, heavy shadows, dramatic light.'
  },
  {
    id: 'Watercolor_Whimsy',
    label: labelFromStyleName('Watercolor_Whimsy'),
    description: 'Loose watercolor blooms, soft edges, gentle color gradients, light paper texture.'
  },
  {
    id: 'Woodcut_Vintage',
    label: labelFromStyleName('Woodcut_Vintage'),
    description: 'Carved line texture, high-contrast black and white, vintage print look.'
  },
  {
    id: 'Comic_Strip_Satire',
    label: labelFromStyleName('Comic_Strip_Satire'),
    description: 'Clean comic linework, simple cel shading, punchy expressions, speech-bubble-ready.'
  },
  {
    id: 'Claymation_3D',
    label: labelFromStyleName('Claymation_3D'),
    description: 'Soft clay surfaces, rounded forms, subtle fingerprints, studio lighting.'
  },
  {
    id: 'Lowpoly_Faceted',
    label: labelFromStyleName('Lowpoly_Faceted'),
    description: 'Geometric facets, angular planes, sharp edges, vivid but limited palette.'
  },
  {
    id: 'Neon_Retro_Chrome',
    label: labelFromStyleName('Neon_Retro_Chrome'),
    description: '80s airbrush feel, chrome highlights, neon accents, glossy finish.'
  }
];

export const STYLE_IDS = styles.map((style) => style.id);

export function listStyles() {
  return styles.map((style) => ({ ...style }));
}

export function getStyle(styleId) {
  return styles.find((style) => style.id === styleId) ?? null;
}
