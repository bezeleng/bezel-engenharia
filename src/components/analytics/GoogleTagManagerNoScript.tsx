// src/components/analytics/GoogleTagManagerNoScript.tsx
export function GoogleTagManagerNoScript() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  if (!gtmId) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}