import { describe, it, expect } from 'vitest';
import { slugify } from '../shared/utils/slugify';

describe('slugify', () => {
  it('converts spaces and uppercase letters', () => {
    expect(slugify('Example Icon')).toBe('example-icon');
  });

  it('trims whitespace and removes special chars', () => {
    expect(slugify('  Hello@World!  ')).toBe('helloworld');
  });

  it('replaces multiple spaces with single dash', () => {
    expect(slugify('icon   name')).toBe('icon-name');
  });
});
