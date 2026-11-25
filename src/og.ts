// Social preview cards (1200×630 JPEG), rendered at build time with sharp.
// Served by src/pages/og.jpg.ts (site default) and src/pages/og/[...slug].jpg.ts (one per post).
// JPEG keeps cards with photos well under the ~300 KB some apps (e.g. WhatsApp) accept.
// Colors mirror the light theme in src/styles/global.css.
import type { ImageMetadata } from 'astro';
import sharp from 'sharp';
import { SITE } from './consts';
import { logoMarkup } from './logo';

export const OG_SIZE = { width: 1200, height: 630 };
const { width: W, height: H } = OG_SIZE;
const PAD = 90;

const BG = '#fcfbf8';
const TEXT = '#1d1c1a';
const MUTED = '#6b675f';
const ACCENT = '#d6452f';

// Helvetica locally; GitHub Actions has no Helvetica and falls back to the wider DejaVu Sans,
// so text widths below are estimated generously.
const FONT = `'Helvetica Neue', Helvetica, 'DejaVu Sans', Arial, sans-serif`;
const CHAR_WIDTH = 0.6; // average bold glyph width, as a fraction of the font size

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const text = (x: number, y: number, size: number, fill: string, content: string, extra = '') =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" fill="${fill}" ${extra}>${escape(content)}</text>`;

/** Accent bar plus the logo and host name at the top left. */
function frame(): string {
  const host = new URL(import.meta.env.SITE).host;
  return (
    `<rect width="${W}" height="${H}" fill="${BG}"/>` +
    `<rect width="${W}" height="12" fill="${ACCENT}"/>` +
    `<g transform="translate(${PAD} 90) scale(1.5)">${logoMarkup(`fill="${ACCENT}"`)}</g>` +
    text(PAD + 66, 126, 30, MUTED, host, 'font-weight="600"')
  );
}

/** Greedy word wrap using an estimated glyph width. */
function wrap(s: string, size: number, maxWidth: number): string[] {
  const maxChars = Math.floor(maxWidth / (size * CHAR_WIDTH));
  const lines: string[] = [];
  for (const word of s.split(/\s+/)) {
    const last = lines.at(-1);
    if (last !== undefined && (last + ' ' + word).length <= maxChars) lines[lines.length - 1] = last + ' ' + word;
    else lines.push(word);
  }
  return lines;
}

/** Splits a short string into two lines of roughly equal length. */
function splitBalanced(s: string): string[] {
  const words = s.split(' ');
  let best = [s];
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    const diff = Math.abs(a.length - b.length);
    if (diff < bestDiff) [best, bestDiff] = [[a, b], diff];
  }
  return best;
}

// GitHub avatar cut into a circle, cached per size so each build fetches it once.
const avatars = new Map<number, Promise<Buffer | null>>();
function avatar(size: number): Promise<Buffer | null> {
  if (!avatars.has(size)) {
    avatars.set(
      size,
      (async () => {
        try {
          const res = await fetch(SITE.avatar.replace(/size=\d+/, `size=${Math.min(size * 2, 800)}`));
          if (!res.ok) return null;
          const mask = `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`;
          return await sharp(Buffer.from(await res.arrayBuffer()))
            .resize(size, size, { fit: 'cover' })
            .composite([{ input: Buffer.from(mask), blend: 'dest-in' }])
            .png()
            .toBuffer();
        } catch {
          return null;
        }
      })(),
    );
  }
  return avatars.get(size)!;
}

/** Ring drawn behind an avatar of `size` placed at (x, y). */
const ring = (x: number, y: number, size: number, width: number) =>
  `<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${size / 2 + width}" fill="${ACCENT}"/>` +
  `<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${size / 2 + 2}" fill="${BG}"/>`;

type Layer = { input: Buffer | null; left: number; top: number };

async function render(svg: string, layers: Layer[]): Promise<Response> {
  const jpg = await sharp(Buffer.from(svg))
    .composite(layers.flatMap(({ input, left, top }) => (input ? [{ input, left, top }] : [])))
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { 'Content-Type': 'image/jpeg' } });
}

/** Crops a content-collection image from its source file. Null when the file can't be found. */
async function crop(image: ImageMetadata, width: number, height: number, position: string): Promise<Buffer | null> {
  // Astro sets this (non-enumerable) on imported images; it's what its own image service reads.
  const fsPath = (image as ImageMetadata & { fsPath?: string }).fsPath;
  if (!fsPath) return null;
  try {
    return await sharp(fsPath).resize(width, height, { fit: 'cover', position }).png().toBuffer();
  } catch {
    return null;
  }
}

/** Site-wide card: name, role and a large photo. */
export async function siteCard(): Promise<Response> {
  const size = 380;
  const x = W - PAD - size;
  const y = (H - size) / 2;
  const photo = await avatar(size);

  const name = splitBalanced(SITE.author);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
    frame() +
    name.map((line, i) => text(PAD, 290 + i * 74, 62, TEXT, line, 'font-weight="700" letter-spacing="-1"')).join('') +
    text(PAD, 290 + name.length * 74 + 28, 30, MUTED, SITE.role) +
    (photo ? ring(x, y, size, 8) : '') +
    `</svg>`;
  return render(svg, [{ input: photo, left: x, top: y }]);
}

/**
 * Per-page card: a big title, then a byline with a small photo and a meta line.
 * With an image (e.g. a post's cover), it fills a panel on the right, cropped around `imagePosition`.
 */
export async function pageCard({
  title,
  meta,
  image,
  imagePosition = 'center',
}: {
  title: string;
  meta?: string;
  image?: ImageMetadata;
  imagePosition?: string;
}): Promise<Response> {
  const panelWidth = 440;
  const panelTop = 12; // below the accent bar
  const cover = image ? await crop(image, panelWidth, H - panelTop, imagePosition) : null;
  const maxWidth = cover ? W - panelWidth - 60 - PAD : W - 2 * PAD;
  // Largest font size that fits the title in three lines.
  let size = 40;
  let lines = wrap(title, size, maxWidth);
  for (const s of [68, 60, 52, 46]) {
    const l = wrap(title, s, maxWidth);
    if (l.length <= 3) [size, lines] = [s, l];
    if (l.length <= 3) break;
  }
  const lineHeight = Math.round(size * 1.18);

  const photoSize = 84;
  const photoY = H - PAD - photoSize + 10;
  const photo = await avatar(photoSize);
  const bylineX = PAD + (photo ? photoSize + 28 : 0);

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
    frame() +
    lines.map((line, i) => text(PAD, 215 + size + i * lineHeight, size, TEXT, line, 'font-weight="700" letter-spacing="-1"')).join('') +
    (photo ? ring(PAD, photoY, photoSize, 4) : '') +
    text(bylineX, photoY + (meta ? 36 : 52), cover ? 24 : 28, TEXT, SITE.author, 'font-weight="600"') +
    (meta ? text(bylineX, photoY + 74, 24, MUTED, meta) : '') +
    `</svg>`;
  return render(svg, [
    { input: photo, left: PAD, top: photoY },
    { input: cover, left: W - panelWidth, top: panelTop },
  ]);
}
