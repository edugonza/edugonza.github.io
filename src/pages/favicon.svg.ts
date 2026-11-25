import { faviconSvg } from '../logo';

// Built to /favicon.svg from the shared logo in src/logo.ts.
export function GET() {
  return new Response(faviconSvg(), {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
}
