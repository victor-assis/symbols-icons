import { readFileSync } from 'fs';
import { describe, it, expect } from 'vitest';
import { generateSFSymbol } from '../shared/sfSymbol/convertSFSymbol';

const template = readFileSync('shared/sfSymbol/template.svg', 'utf8');
const icons = [
  { svg: '<svg width="32" height="32"><rect width="32" height="32"/></svg>' },
];
const selected = new Set(['s-regular']);

describe('generateSFSymbol', () => {
  it('creates sf symbol svg for each icon', () => {
    const result = generateSFSymbol(template, icons, selected, 32);
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('<svg');
  });
});
