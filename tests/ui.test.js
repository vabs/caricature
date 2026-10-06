import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const publicDir = path.join(process.cwd(), 'public');

describe('compact UI', () => {
  test('uses a compact style select with a selected-style description', () => {
    const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');

    expect(html).toContain('rel="icon"');
    expect(html).toContain('href="/favicon.svg"');
    expect(html).toContain('id="style-select"');
    expect(html).toContain('name="style"');
    expect(html).toContain('id="style-description"');
    expect(html).not.toContain('id="style-options"');
  });

  test('hides provider selection and always submits Google Gemini', () => {
    const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
    const js = fs.readFileSync(path.join(publicDir, 'app.js'), 'utf8');

    expect(html).toContain('<input type="hidden" name="provider" value="google">');
    expect(html).not.toContain('id="provider-options"');
    expect(js).not.toContain('/api/providers');
  });

  test('client script populates the select and updates its description', () => {
    const js = fs.readFileSync(path.join(publicDir, 'app.js'), 'utf8');

    expect(js).toContain('styleSelect');
    expect(js).toContain('styleDescription');
    expect(js).toContain('updateStyleDescription');
  });

  test('result rendering does not depend on a removed placeholder element', () => {
    const html = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
    const js = fs.readFileSync(path.join(publicDir, 'app.js'), 'utf8');

    expect(html).not.toContain('id="placeholder"');
    expect(js).not.toContain("querySelector('#placeholder')");
    expect(js).not.toContain('placeholder.hidden');
  });
});
