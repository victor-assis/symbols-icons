import { describe, it, expect } from 'vitest';
import { svgToCompose } from '../shared/kotlin/svgToCompose';

const svg = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M0 0 L10 10 Z"/></svg>';
const svgCurves = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M0 0 C10 10 20 20 30 30 Q40 40 50 50 Z"/></svg>';

describe('svgToCompose', () => {
  it('converts basic path to compose code', () => {
    const result = svgToCompose(svg, 'TestIcon');
    expect(result).toContain('ImageVector.Builder');
    expect(result).toContain('moveTo(0f, 0f)');
    expect(result).toContain('lineTo(10f, 10f)');
    expect(result).toContain('close()');
  });

  it('supports curve and quadratic commands', () => {
    const result = svgToCompose(svgCurves, 'CurvyIcon');
    expect(result).toContain('curveTo(10f, 10f, 20f, 20f, 30f, 30f)');
    expect(result).toContain('quadTo(40f, 40f, 50f, 50f)');
    expect(result).not.toContain('Unsupported command');
  });
});

