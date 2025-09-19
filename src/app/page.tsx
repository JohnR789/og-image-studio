export const dynamic = 'force-dynamic';

function q(params: Record<string,string>) {
  const usp = new URLSearchParams(params);
  return `/api/og?${usp.toString()}`
}

export default function Page() {
  const sample = q({
    title: 'Hello',
    subtitle: 'Edge',
    badge: 'DEMO',
    theme: 'dark'
  });
  return (
    <main style={{padding: 32, fontFamily: 'system-ui, sans-serif'}}>
      <h1 style={{fontSize: 28, marginBottom: 8}}>OG Image Studio</h1>
      <p style={{color:'#555', marginBottom: 24}}>
        A tiny Edge function that renders social images on the fly.
      </p>

      <h2 style={{fontSize: 18, marginBottom: 8}}>Try it</h2>
      <p style={{marginBottom: 12}}>Open this URL in a new tab to see a PNG:</p>
      <pre style={{background:'#f5f5f5', padding:12, borderRadius:8, overflow:'auto'}}>
{sample}
      </pre>

      <h2 style={{fontSize: 18, margin:'24px 0 8px'}}>Preview</h2>
      <img src={sample} width={600} height={315} style={{border:'1px solid #e5e7eb', borderRadius:8}} alt="sample" />

      <h2 style={{fontSize: 18, margin:'24px 0 8px'}}>Query params</h2>
      <ul style={{lineHeight:1.8}}>
        <li><code>title</code> – headline text</li>
        <li><code>subtitle</code> – secondary line</li>
        <li><code>badge</code> – small label in the corner</li>
        <li><code>theme</code> – <code>dark</code> or <code>light</code></li>
      </ul>
    </main>
  );
}
