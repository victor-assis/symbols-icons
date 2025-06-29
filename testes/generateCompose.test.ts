import { describe, it, expect } from 'vitest';
import { svgToCompose } from '../shared/kotlin/svgToCompose';

const svg = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M0 0 L10 10 Z"/></svg>';

describe('svgToCompose', () => {
  it('converts basic path to compose code', () => {
    const result = svgToCompose(svg, 'TestIcon');
    expect(result).toContain('ImageVector.Builder');
    expect(result).toContain('moveTo(0f, 0f)');
    expect(result).toContain('lineTo(10f, 10f)');
    expect(result).toContain('close()');
  });
});

