import { describe, it, expect } from 'vitest';
import {
  generateExample,
  type ExampleFile,
} from '../shared/example/generateExample';

const json = [
  {
    id: '1',
    svg: '<svg></svg>',
    name: 'icon-one',
    figmaName: 'Icon One',
    tags: [],
  },
];
const sprite = '<svg><symbol id="icon-one"></symbol></svg>';

describe('generateExample', () => {
  it('returns files including HTML with embedded sprite', () => {
    const files = generateExample(json, sprite);
    expect(files).toHaveLength(5);
    const html =
      files.find((f: ExampleFile) => f.name === 'index.html')?.content ?? '';
    expect(html).toContain('Icon Preview');
    expect(html).toContain(sprite);
  });
});
