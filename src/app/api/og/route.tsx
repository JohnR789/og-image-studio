import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get('title') ?? 'OG Image Studio';
  const subtitle = searchParams.get('subtitle') ?? '';
  const badge = searchParams.get('badge') ?? '';
  const theme = (searchParams.get('theme') ?? 'light').toLowerCase();
  const bg = searchParams.get('bg') ?? (theme === 'dark' ? '#0b0f17' : '#ffffff');
  const fg = theme === 'dark' ? '#e5e7eb' : '#111827';

  const img = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: bg,
          padding: 64,
        }}
      >
        {/* top row */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', color: fg, opacity: 0.9 }}>
          {badge ? (
            <div
              style={{
                fontSize: 40, lineHeight: 1, borderRadius: 12, padding: '8px 14px',
                background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              }}
            >
              {badge}
            </div>
          ) : null}
        </div>

        {/* center */}
        <div style={{ color: fg }}>
          <div style={{ fontSize: 100, fontWeight: 700 }}>{title}</div>
          {subtitle ? (
            <div style={{ marginTop: 12, fontSize: 44, opacity: 0.8 }}>{subtitle}</div>
          ) : null}
        </div>

        {/* bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', color: fg, opacity: 0.6 }}>
          <div style={{ fontSize: 28 }}>1200×630</div>
          <div style={{ fontSize: 28 }}>og-image-studio</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );

  // Important: wrap ImageResponse in a Response so curl/files aren’t 0 bytes
  return new Response(img.body, {
    headers: {
      'content-type': 'image/png',
      'cache-control': 'no-store',
    },
  });
}
