# OG Image Studio (Edge)

Tiny, production-minded **Open Graph (1200×630) image generator** built with Next.js App Router + `@vercel/og`, running on the **Edge runtime**. Great for dynamic social cards for posts, products, dashboards—anything that needs a branded preview image on the fly.

**Live API:**  
`https://og-image-studio-3k7si2rxt-john-rollins-projects.vercel.app/api/og`

> If you later create a Vercel alias (recommended), update this URL once to something stable like `https://og-image-studio.vercel.app/api/og`.

---

## Features

- ⚡ **Edge runtime** for low-latency, cold-start-friendly rendering  
- 🖼️ **Simple REST endpoint**: `GET /api/og` → returns `image/png` (1200×630)  
- 🧪 **Cache-busting friendly**: `cache-control: no-store` while developing  
- 🧩 Easy to extend with query params (title, subtitle, theme, colors, etc.)  
- 🛠️ No external services or env vars required

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **`@vercel/og`** for server-side image generation
- **Vercel** for deployment

---

## Quick Try

Open in your browser:

https://og-image-studio-3k7si2rxt-john-rollins-projects.vercel.app/api/og?t=NOW

bash
Copy code

Save a PNG with `curl`:

```bash
BASE="https://og-image-studio-3k7si2rxt-john-rollins-projects.vercel.app"
curl -o hello.png "$BASE/api/og?t=$(date +%s)"
file hello.png   # => PNG image data, 1200 x 630
Example with parameters (after you switch to the “richer” route below):

bash
Copy code
curl -o card.png \
  "$BASE/api/og?title=Hello&subtitle=Edge&badge=DEMO&theme=dark&t=$(date +%s)"
API
Endpoint
bash
Copy code
GET /api/og
Response: image/png (1200×630)

Query Parameters (suggested)
Param	Type	Default	Notes
title	string	Hello	Large headline text
subtitle	string	(none)	Smaller supporting text
badge	string	(none)	Small label shown at top-left
theme	enum	light	light or dark
bg	color	#ffffff/#0b0f17	Background hex; if omitted, uses theme

The default project currently returns a simple “Hello” PNG. Swap to the richer example below to support all params.

How It Works
The route is an Edge Function that returns an ImageResponse built from JSX.

Current minimal route: src/app/api/og/route.tsx

tsx
Copy code
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const img = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          color: '#111111',
          fontSize: 128,
          fontWeight: 700,
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        Hello
      </div>
    ),
    { width: 1200, height: 630 }
  );

  return new Response(img.body, {
    headers: {
      'content-type': 'image/png',
      'cache-control': 'no-store',
    },
  });
}
Richer version (supports query params):

tsx
Copy code
import { ImageResponse } from '@vercel/og';
export const runtime = 'edge';

function parseParams(url: string) {
  const { searchParams } = new URL(url);
  const theme = (searchParams.get('theme') || 'light').toLowerCase();
  const bg = searchParams.get('bg') || (theme === 'dark' ? '#0b0f17' : '#ffffff');
  const fg = theme === 'dark' ? '#e5e7eb' : '#111827';
  return {
    title: searchParams.get('title') || 'OG Image Studio',
    subtitle: searchParams.get('subtitle') || '',
    badge: searchParams.get('badge') || '',
    bg,
    fg,
  };
}

export async function GET(req: Request) {
  const { title, subtitle, badge, bg, fg } = parseParams(req.url);
  const img = new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: bg,
          padding: 64,
        }}
      >
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {badge && (
            <div
              style={{
                fontSize: 56,
                borderRadius: 12,
                padding: '8px 14px',
                background: 'rgba(255,255,255,0.08)',
                color: fg,
              }}
            >
              {badge}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: fg, fontSize: 96, fontWeight: 800 }}>{title}</div>
          {subtitle && (
            <div style={{ color: fg, fontSize: 36, opacity: 0.85 }}>{subtitle}</div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', color: fg, opacity: 0.7 }}>
          <div style={{ fontSize: 28 }}>1200×630</div>
          <div style={{ fontSize: 28 }}>og-image-studio</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );

  return new Response(img.body, {
    headers: {
      'content-type': 'image/png',
      'cache-control': 'no-store',
    },
  });
}
Use It in Pages (Open Graph)
Point og:image (and twitter:image) at your API:

html
Copy code
<meta property="og:image" content="https://og-image-studio-3k7si2rxt-john-rollins-projects.vercel.app/api/og?title=My%20Post&subtitle=TIL" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://og-image-studio-3k7si2rxt-john-rollins-projects.vercel.app/api/og?title=My%20Post&subtitle=TIL" />
With Next.js App Router, you can also return this URL from generateMetadata.

Local Development
bash
Copy code
npm install
npm run dev
# http://localhost:3000/api/og

# Test with cache-busting query
curl -o hello.png "http://localhost:3000/api/og?t=$(date +%s)"
Deploy
This repo is linked to Vercel. Every push to main triggers a production build.

bash
Copy code
git add -A
git commit -m "feat: update card style"
git push
(Optional) Set a stable alias once so your README never needs updating:

bash
Copy code
vercel alias set og-image-studio-3k7si2rxt-john-rollins-projects.vercel.app og-image-studio.vercel.app
Project Structure
pgsql
Copy code
.
├── src/app/api/og/route.tsx   # Edge function that returns the PNG
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md
Troubleshooting
Saved file is 0 bytes
Append ?t=<timestamp> to bypass CDN/browser caches and ensure the route returns
content-type: image/png and cache-control: no-store.

401 Vercel “Authentication Required” page
Your project likely has Deployment Protection enabled. Disable it (Project → Settings → Security) or use a bypass token for automation.

TypeScript/JSX errors
Make sure the file is .tsx (since it contains JSX) and @vercel/og is installed.

Roadmap Ideas
Custom fonts (Google Fonts or bundled TTF)

Theme presets (brand palettes)

Emojis/avatars, gradients, patterns

Presigned/HMAC’d URLs to prevent abuse

Basic rate limiting & logging

License
MIT © 2025 John Rollins
