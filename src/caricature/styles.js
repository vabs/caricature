import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROMPT_CATALOG_PATH = path.join(__dirname, '..', '..', 'prompt.txt');

function labelFromStyleName(styleName) {
  return styleName.replaceAll('_', ' ');
}

function parseStyleCatalog(promptText) {
  const styleBlocks = promptText.matchAll(
    /\d+\.\s*STYLE:\s*([A-Za-z0-9_]+)\s*([\s\S]*?)(?=\n\s*\d+\.\s*STYLE:|\n\s*How to use:|$)/g
  );

  return [...styleBlocks].map((match) => {
    const id = match[1];
    const description = match[2].match(/^\s*-\s+(.+)$/m)?.[1]?.trim();

    if (!description) {
      throw new Error(`Missing description for style ${id}.`);
    }

    return {
      id,
      label: labelFromStyleName(id),
      description
    };
  });
}

const styles = parseStyleCatalog(fs.readFileSync(PROMPT_CATALOG_PATH, 'utf8'));

export const STYLE_IDS = styles.map((style) => style.id);

export function listStyles() {
  return styles.map((style) => ({ ...style }));
}

export function getStyle(styleId) {
  return styles.find((style) => style.id === styleId) ?? null;
}
