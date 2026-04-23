export function applyRuntimeCsp() {
  const meta = document.querySelector<HTMLMetaElement>('meta[http-equiv="Content-Security-Policy"]');
  if (!meta) return;

  const siteUrl = import.meta.env.NEXT_PUBLIC_SITE_URL || 'https://localhost';
  const apiUrl = import.meta.env.NEXT_PUBLIC_BASE_URL || '';

  // Note: Telegram WebView + Vite dev uses WebSocket (HMR). Allow ws/wss so dev over ngrok doesn't break.
  const connectSources = [
    "'self'",
    'https:',
    'http:',
    'wss:',
    'ws:',
    'https://telegram.org',
    'https://*.telegram.org',
  ];
  if (/^https?:\/\//i.test(apiUrl)) {
    try {
      connectSources.push(new URL(apiUrl).origin);
    } catch {
      // ignore malformed env
    }
  }

  meta.setAttribute(
    'content',
    `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://telegram.org; connect-src ${connectSources.join(
      ' '
    )}; img-src 'self' data: blob: https://*; style-src 'self' 'unsafe-inline'; font-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors https://web.telegram.org https://*.telegram.org;`
  );

  // Keep metadata base origin consistent for downstream code that reads it
  try {
    const resolved = new URL(siteUrl);
    document.documentElement.dataset.siteOrigin = resolved.origin;
  } catch {
    // ignore
  }
}
