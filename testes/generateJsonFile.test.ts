import { describe, expect, it } from 'vitest';
import { ISerializedSVG } from '../shared/types/typings';
import { generateJsonFile } from '../shared/jsonFile/convertJsonFile';

describe('generateJsonFile', () => {
  it('preserves originalSvg when provided', () => {
    const files: ISerializedSVG[] = [
      {
        id: '1',
        name: 'Test Icon',
        svg: '<svg></svg>',
        originalSvg: '<svg id="orig"></svg>',
      },
    ];
    const json = generateJsonFile(files);
    expect(json[0].originalSvg).toBe('<svg id="orig"></svg>');
  });
});
