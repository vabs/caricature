import { describe, expect, test } from 'vitest';

import {
  getStyle,
  listStyles,
  STYLE_IDS
} from '../src/caricature/styles.js';

describe('caricature styles', () => {
  test('exposes the four planned preset styles', () => {
    expect(STYLE_IDS).toEqual([
      'friendly-cartoon',
      'editorial-exaggeration',
      'vintage-comic',
      'studio-mascot'
    ]);

    expect(listStyles()).toHaveLength(4);
  });

  test('returns a style for supported IDs and null for unsupported IDs', () => {
    expect(getStyle('friendly-cartoon')).toMatchObject({
      id: 'friendly-cartoon',
      label: 'Friendly cartoon'
    });

    expect(getStyle('freeform')).toBeNull();
  });
});
