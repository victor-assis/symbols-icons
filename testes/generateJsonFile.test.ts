import { describe, it, expect } from 'vitest';
import { generateJsonFile } from '../shared/jsonFile/convertJsonFile';

const files = [
  { id: '1', svg: '<svg></svg>', name: 'Icon One' },
  { id: '2', svg: '<svg></svg>', name: 'Another Icon' },
];

describe('generateJsonFile', () => {
  it('creates JSON entries with slugified names', () => {
    const result = generateJsonFile(files);
    expect(result).toEqual([
      {
        id: '1',
        svg: '<svg></svg>',
        name: 'icon-one',
        figmaName: 'Icon One',
      },
      {
        id: '2',
        svg: '<svg></svg>',
        name: 'another-icon',
        figmaName: 'Another Icon',
      },
    ]);
  });
});
