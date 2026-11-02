// Cloudflare Pages reverse proxy: /api/* -> backend Render.
// Cookie tetap same-origin (tartila.pages.dev) sehingga browser tidak
// memblokirnya sebagai third-party cookie.

const BACKEND_ORIGIN = "https://pengajian-backend.onrender.com";

export const onRequest = async (context: {
  request: Request;
  next: () => Promise<Response>;
}): Promise<Response> => {
  const url = new URL(context.request.url);
  if (!url.pathname.startsWith("/api/")) {
    return context.next();
  }

  const target = `${BACKEND_ORIGIN}${url.pathname}${url.search}`;
  // new Request(target, request) meneruskan method, body, dan headers
  // (termasuk Cookie & Authorization) tanpa perlu disalin manual.
  return fetch(new Request(target, context.request));
};
