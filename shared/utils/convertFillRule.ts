import svgpath from 'svgpath';
import { parseSVG } from 'svg-path-parser';
import { reverse as reversePath } from 'svg-path-reverse';

(
  svgpath as unknown as {
    prototype: { reverse: () => typeof svgpath };
  }
).prototype.reverse = function () {
  const rev = reversePath(this.toString());
  this.segments = svgpath(rev).segments;
  return this;
};

type Segment = (string | number)[];

interface Command {
  code: string;
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  rx?: number;
  ry?: number;
  xAxisRotation?: number;
  largeArc?: boolean;
  sweep?: boolean;
}

function commandToSegment(cmd: Command): Segment {
  switch (cmd.code) {
  case 'M':
  case 'L':
  case 'T':
    return [cmd.code, cmd.x ?? 0, cmd.y ?? 0];
  case 'H':
    return [cmd.code, cmd.x ?? 0];
  case 'V':
    return [cmd.code, cmd.y ?? 0];
  case 'C':
    return [
      cmd.code,
      cmd.x1 ?? 0,
      cmd.y1 ?? 0,
      cmd.x2 ?? 0,
      cmd.y2 ?? 0,
      cmd.x ?? 0,
      cmd.y ?? 0,
    ];
  case 'S':
    return [cmd.code, cmd.x2 ?? 0, cmd.y2 ?? 0, cmd.x ?? 0, cmd.y ?? 0];
  case 'Q':
    return [cmd.code, cmd.x1 ?? 0, cmd.y1 ?? 0, cmd.x ?? 0, cmd.y ?? 0];
  case 'A':
    return [
      cmd.code,
      cmd.rx ?? 0,
      cmd.ry ?? 0,
      cmd.xAxisRotation ?? 0,
      cmd.largeArc ? 1 : 0,
      cmd.sweep ? 1 : 0,
      cmd.x ?? 0,
      cmd.y ?? 0,
    ];
  case 'Z':
    return ['Z'];
  default:
    return [cmd.code];
  }
}

/**
 * Convert paths using fill-rule="evenodd" into equivalent paths using
 * fill-rule="nonzero" by reversing inner subpaths.
 *
 * @param svg - SVG content as string or Document.
 * @returns Updated SVG string or Document (same type as input).
 */
export function convertFillRule(svg: string | Document): string | Document {
  const doc =
    typeof svg === 'string'
      ? new DOMParser().parseFromString(svg, 'image/svg+xml')
      : svg;

  const docAny = doc as unknown as {
    querySelectorAll?: (selector: string) => NodeListOf<Element>;
    getElementsByTagName: (name: string) => ArrayLike<Element>;
  };

  const paths =
    typeof docAny.querySelectorAll === 'function'
      ? Array.from(docAny.querySelectorAll('path[fill-rule="evenodd"]'))
      : Array.from(docAny.getElementsByTagName('path')).filter(
        (p) => p.getAttribute('fill-rule') === 'evenodd',
      );

  paths.forEach((path) => {
    const d = path.getAttribute('d');
    if (!d) return;

    const commands = parseSVG(d) as Command[];
    const subpaths: Segment[][] = [];
    let current: Segment[] = [];

    commands.forEach((cmd: Command) => {
      const seg = commandToSegment(cmd);
      if (cmd.code === 'M' && current.length) {
        subpaths.push(current);
        current = [seg];
      } else {
        current.push(seg);
      }
    });
    if (current.length) subpaths.push(current);

    const newD = subpaths
      .map((segments, index) => {
        const p = svgpath('');
        p.segments = segments;
        const part = p.toString();
        return index === 0 ? part : svgpath(part).reverse().toString();
      })
      .join('');

    path.setAttribute('d', newD);
    path.setAttribute('fill-rule', 'nonzero');
  });

  return typeof svg === 'string' ? new XMLSerializer().serializeToString(doc) : doc;
}
