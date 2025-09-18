'use client';
import { useEffect, useMemo, useState } from 'react';

export default function Home() {
  const [title, setTitle] = useState('OG Image Studio');
  const [subtitle, setSubtitle] = useState('Generated at the edge');
  const [emoji, setEmoji] = useState('✨');
  const [badge, setBadge] = useState('NEXT.JS');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [bg, setBg] = useState('');

  const previewUrl = useMemo(() => {
    const params = new URLSearchParams({
      title, subtitle, emoji, badge, theme
    });
    if (bg) params.set('bg', bg);
    return `/api/og?${params.toString()}`;
  }, [title, subtitle, emoji, badge, theme, bg]);

  // debounce the image reload a bit
  const [src, setSrc] = useState(previewUrl);
  useEffect(() => {
    const t = setTimeout(() => setSrc(previewUrl), 200);
    return () => clearTimeout(t);
  }, [previewUrl]);

  return (
    <main style={{ padding: 24, display: 'grid', gap: 24, gridTemplateColumns: '380px 1fr', alignItems: 'start' }}>
      <section style={{ display: 'grid', gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>OG Image Studio</h1>
        <label>Title
          <input value={title} onChange={e => setTitle(e.target.value)} style={input} />
        </label>
        <label>Subtitle
          <input value={subtitle} onChange={e => setSubtitle(e.target.value)} style={input} />
        </label>
        <label>Emoji
          <input value={emoji} onChange={e => setEmoji(e.target.value)} style={input} />
        </label>
        <label>Badge
          <input value={badge} onChange={e => setBadge(e.target.value)} style={input} />
        </label>
        <label>Theme
          <select value={theme} onChange={e => setTheme(e.target.value as any)} style={input}>
            <option value="dark">dark</option>
            <option value="light">light</option>
          </select>
        </label>
        <label>Custom BG (hex/rgb)
          <input placeholder="#0b0f17" value={bg} onChange={e => setBg(e.target.value)} style={input} />
        </label>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          Shareable URL: <code>{previewUrl}</code>
        </div>
      </section>

      <section style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 12, background: '#fff' }}>
        <div style={{ fontSize: 12, marginBottom: 8, opacity: 0.7 }}>Preview (1200×630)</div>
        <img src={src} alt="preview" style={{ width: '100%', borderRadius: 8 }} />
      </section>
    </main>
  );
}

const input: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
  display: 'block',
  marginTop: 4,
  marginBottom: 10
};
