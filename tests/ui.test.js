import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const publicDir = path.join(process.cwd(), 'public');

describe('compact UI', () => {
  test('uses a compact style select with a selected-style description', () => {
    const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');

    expect(html).toContain('id="style-select"');
    expect(html).toContain('name="style"');
    expect(html).toContain('id="style-description"');
    expect(html).not.toContain('id="style-options"');
  });

  test('renders providers as a segmented control', () => {
    const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
    const css = fs.readFileSync(path.join(publicDir, 'styles.css'), 'utf8');

    expect(html).toContain('class="segmented"');
    expect(css).toContain('.segmented');
    expect(css).toContain('grid-template-columns: repeat(2, minmax(0, 1fr))');
  });

  test('client script populates the select and updates its description', () => {
    const js = fs.readFileSync(path.join(publicDir, 'app.js'), 'utf8');

    expect(js).toContain('styleSelect');
    expect(js).toContain('styleDescription');
    expect(js).toContain('updateStyleDescription');
  });
});
