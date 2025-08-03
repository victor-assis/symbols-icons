import { describe, it, expect } from 'vitest';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { convertFillRule } from '../shared/utils/convertFillRule';

(globalThis as unknown as { DOMParser: typeof DOMParser }).DOMParser = DOMParser;
(globalThis as unknown as { XMLSerializer: typeof XMLSerializer }).XMLSerializer =
  XMLSerializer;

describe('convertFillRule', () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M0 0L10 0L10 10L0 10ZM2 2L8 2L8 8L2 8Z"/></svg>';

  it('converts evenodd paths to nonzero and reverses holes', () => {
    const result = convertFillRule(svg) as string;
    expect(result).toContain('fill-rule="nonzero"');
    expect(result).toContain('M2 8L8 8 8 2 2 2Z');
  });

  it('accepts Document input', () => {
    const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
    const outDoc = convertFillRule(doc) as Document;
    const path = outDoc.getElementsByTagName('path')[0];
    expect(path.getAttribute('fill-rule')).toBe('nonzero');
  });
});
