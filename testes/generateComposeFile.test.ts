import { describe, it, expect } from 'vitest';
import { ISerializedSVG } from '../shared/types/typings';
import { generateComposeFile } from '../shared/kotlin/svgToCompose';

const icons: ISerializedSVG[] = [
  { id: '1', svg: '<svg width="24" height="24"><path d="M0 0 L10 10 Z"/></svg>', name: 'Icon One' },
];

describe('generateComposeFile', () => {
  it('creates one Kotlin file per icon', () => {
    const files = generateComposeFile(icons);
    expect(files).toHaveLength(1);
    expect(files[0].name).toBe('IconOne.kt');
    expect(files[0].content).toContain('val IconOne');
    expect(files[0].content).toContain('ImageVector.Builder');
  });
});
