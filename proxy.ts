import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Security hardening layer (Next 16 `proxy` — the renamed `middleware`).
 *
 * What it does:
 * - Generates a fresh, per-request CSP nonce and forwards it to the SSR
 *   renderer via the `x-nonce` header, so Next.js automatically attaches it
 *   to its own framework/page inline scripts.
 * - Applies a Content-Security-Policy tuned for this site:
 *     * Every resource is same-origin (no third-party scripts/fonts/images).
 *     * `style-src 'unsafe-inline'` is required because React inline
 *       `style={{...}}` attributes (Navbar, ProcessVisual, …) and GSAP
 *       runtime animation styles are used.
 * - Adds standard hardening headers (MIME sniffing, framing, referrer,
 *   permissions, opener isolation, HSTS).
 *
 * IMPORTANT: nonce support requires DYNAMIC rendering. `app/layout.tsx`
 * calls `await connection()` to opt the page in (see docs
 * "content-security-policy" -> "Forcing dynamic rendering").
 */

function randomNonce(): string {
  // 32 hex chars — a valid CSP `base64-value` (hex is a subset of the
  // base64 alphabet). Avoids `Buffer`, so it works on both Node and Edge
  // runtimes. Node 18+ / Edge both expose the global webcrypto object.
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function buildCsp(nonce: string, isDev: boolean): string {
  return [
    "default-src 'self'",
    // Next adds the nonce to every script it emits. 'strict-dynamic' keeps
    // lazily-injected chunks (GSAP / Three.js) trusted. React dev mode needs
    // 'unsafe-eval'; production does not (Next/React never eval in prod).
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // React inline `style={{...}}` attributes + GSAP -> style-src must allow inline.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function proxy(request: NextRequest): NextResponse {
  const isDev = process.env.NODE_ENV === "development";
  const nonce = randomNonce();
  const csp = buildCsp(nonce, isDev);

  // Pass the nonce to the SSR renderer so Next.js can nonce its own scripts
  // and inline styles generated during rendering.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // ---- Security headers ----------------------------------------------
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY"); // legacy fallback; CSP frame-ancestors covers modern browsers
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  );
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  if (!isDev) {
    // Only meaningful over HTTPS (ignored on plain HTTP); safe to set always.
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  return response;
}

export const config = {
  // Run on HTML routes only — skip same-origin static assets (js/css/img),
  // favicon, metadata files, and Next prefetch requests.
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};