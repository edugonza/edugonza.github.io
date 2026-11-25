// Single source for the site logo: a `>_` prompt on a rounded tile.
// The header inlines it (src/components/Header.astro) and /favicon.svg is
// generated from it (src/pages/favicon.svg.ts), so edit the mark here only.

/**
 * Inner SVG markup on a 32×32 grid. `tileAttrs` styles the background tile
 * (defaults to the surrounding text color); the prompt glyph is white.
 */
export function logoMarkup(tileAttrs = 'fill="currentColor"'): string {
  return (
    `<rect width="32" height="32" rx="7" ${tileAttrs}/>` +
    `<path fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="m9 10.5 5.5 5.5L9 21.5M17.5 22h6"/>`
  );
}

// Mirrors --accent in src/styles/global.css, since the favicon can't read CSS variables.
const ACCENT_LIGHT = '#d6452f';
const ACCENT_DARK = '#ff7a5c';

/** Standalone SVG document for the favicon; follows the OS color scheme. */
export function faviconSvg(): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
    `<style>.tile{fill:${ACCENT_LIGHT}}@media (prefers-color-scheme: dark){.tile{fill:${ACCENT_DARK}}}</style>` +
    logoMarkup('class="tile"') +
    `</svg>`
  );
}
