import { describe, it, expect } from 'vitest';
import { generateComposeFile } from '../shared/kotlin/svgToCompose';

const icons = [
  { id: '1', svg: '<svg width="24" height="24"><path d="M0 0 L10 10 Z"/></svg>', name: 'Icon One' },
];

describe('generateComposeFile', () => {
  it('creates a Kotlin object with icons', () => {
    const file = generateComposeFile(icons as any);
    expect(file.name).toBe('Icons.kt');
    expect(file.content).toContain('object Icons');
    expect(file.content).toContain('ImageVector.Builder');
  });
});
