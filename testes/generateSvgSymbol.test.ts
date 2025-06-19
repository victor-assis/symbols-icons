import { describe, it, expect } from 'vitest';
import { generateSvgSymbol } from '../shared/svgSymbol/convertSvgSymbol';

const files = [
  {
    id: '1',
    svg: '<svg viewBox="0 0 16 16"><path d=""/></svg>',
    name: 'Icon 1',
  },
  {
    id: '2',
    svg: '<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"/></svg>',
    name: 'Another Icon',
  },
];

describe('generateSvgSymbol', () => {
  it('wraps icons in <symbol> tags with slugified ids', () => {
    const sprite = generateSvgSymbol(files);
    expect(sprite).toContain('<symbol');
    expect(sprite).toContain('id="icon-1"');
    expect(sprite).toContain('id="another-icon"');
  });
});
