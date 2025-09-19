# OG Image Studio

A tiny Next.js (App Router) service that generates **Open Graph images on-the-fly** at the edge using [`@vercel/og`](https://vercel.com/docs/functions/og-image-generation/og-image-generation). Perfect for dynamic social cards: blog posts, product pages, and dashboards.

> **Production URL:** `https://<your-project>.vercel.app`
>
> Replace with your actual Vercel domain.

---

## Features

* **Edge runtime** for fast, low-latency rendering
* Simple **REST endpoint**: `GET /api/og` → returns a PNG (1200×630)
* **No env vars required**
* **Cache control** set to `no-store` to avoid CDN caching while developing
* Works with query params for title, subtitle, theme, etc. (easy to extend)

## Tech Stack

* **Next.js 14** (App Router)
* **TypeScript**
* **@vercel/og** for server-side image generation
* **Vercel** for deployment

---

## API

### Endpoint

```
GET /api/og
```

**Response**: `image/png` (1200×630)

### Query Parameters

| Param      | Type   | Default             | Notes                                  |
| ---------- | ------ | ------------------- | -------------------------------------- |
| `title`    | string | `Hello`             | Large headline text                    |
| `subtitle` | string | *(none)*            | Smaller supporting text                |
| `badge`    | string | *(none)*            | Small label shown top-left             |
| `theme`    | enum   | `light`             | `light` or `dark`                      |
| `bg`       | color  | `#ffffff / #0b0f17` | Background hex. If omitted, uses theme |

> The starter version in this repo returns a simple **“Hello”** image. Swap in the more featureful JSX (example below) to support additional params.

### Quick Tests

* **Open in browser**:

  ```
  https://<your-project>.vercel.app/api/og?title=Hello&subtitle=Edge&badge=DEMO&theme=dark
  ```
* **Save a PNG**:

  ```bash
  BASE="https://<your-project>.vercel.app"
  curl -o hello.png "$BASE/api/og?title=Hello&subtitle=Edge&badge=DEMO&theme=dark&t=$(date +%s)"
  ```
* **Inspect the file** (macOS):

  ```bash
  file hello.png && open hello.png
  ```

---

## How it Works

The API route uses the **Edge Runtime** and creates an `ImageResponse` from JSX.

**Minimal route (current default):** `src/app/api/og/route.tsx`

```tsx
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
```

**Richer version (supports query params):**

```tsx
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
```

---

## Add to Your Pages (Open Graph)

Use the API URL as your `og:image` (and `twitter:image`) in your page’s head.

```html
<meta property="og:image" content="https://<your-project>.vercel.app/api/og?title=My%20Post&subtitle=TIL" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://<your-project>.vercel.app/api/og?title=My%20Post&subtitle=TIL" />
```

With Next.js App Router, you can also compute this in `generateMetadata` and return a URL string for `openGraph.images`.

---

## Local Development

```bash
# 1) Install deps
npm install

# 2) Run dev server
npm run dev
# http://localhost:3000/api/og

# 3) Test the endpoint
curl -o hello.png "http://localhost:3000/api/og?t=$(date +%s)"
```

> If you paste commands from this README: lines starting with `#` are comments—skip them if you’re copying into your terminal.

---

## Deploy

### One-time setup

* Create or link a project on **Vercel**.
* Connect the GitHub repo `JohnR789/og-image-studio` to the Vercel project (Settings → Git → Connect).

### Deploy flow

```bash
# any change on main will auto-deploy
git add -A
git commit -m "feat: update card style"
git push
```

Then visit your Vercel dashboard to grab the **Production URL** and test `/api/og`.

---

## Project Structure

```
.
├── src/app/api/og/route.tsx   # Edge function that returns the PNG
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md
```

---

## Troubleshooting

* **401 / Vercel Authentication page**: Your project likely has **Deployment Protection** enabled. Disable it in Vercel → Project Settings → Security, or use a bypass token in automation.
* **`content-length: 0` or empty files**: You may be hitting a cached domain/URL. Add a cache-busting query (e.g., `?t=TIMESTAMP`) and ensure the response sets `cache-control: no-store`.
* **Type errors**: Ensure `@vercel/og` is installed and the file is **`.tsx`** (JSX requires it in this setup).

---

## Roadmap Ideas

* Custom fonts (Google Fonts or bundled TTF)
* Theme presets (brand palettes)
* Emoji/avatars, gradients, patterns
* Presigned URLs / HMAC to prevent abuse
* Rate limiting (KV, Redis)

## License

MIT © 2025 John Rollins
