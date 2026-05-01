import { describe, expect, test } from 'vitest';

import {
  getStyle,
  listStyles,
  STYLE_IDS
} from '../src/caricature/styles.js';

describe('caricature styles', () => {
  test('exposes the ten styles from the prompt catalog', () => {
    expect(STYLE_IDS).toEqual([
      'Ink_Wash_Classic',
      'Bold_Vector_Pop',
      'Pencil_Sketch_Studio',
      'Charcoal_Drama',
      'Watercolor_Whimsy',
      'Woodcut_Vintage',
      'Comic_Strip_Satire',
      'Claymation_3D',
      'Lowpoly_Faceted',
      'Neon_Retro_Chrome'
    ]);

    expect(listStyles()).toHaveLength(10);
  });

  test('returns a style for supported IDs and null for unsupported IDs', () => {
    expect(getStyle('Ink_Wash_Classic')).toMatchObject({
      id: 'Ink_Wash_Classic',
      label: 'Ink Wash Classic',
      description: 'Expressive ink outlines with soft grayscale washes, paper texture, elegant brush strokes.'
    });

    expect(getStyle('freeform')).toBeNull();
  });
});
