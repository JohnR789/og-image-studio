export const metadata = {
  title: 'OG Image Studio',
  description: 'Generate dynamic Open Graph images at the edge'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial' }}>
        {children}
      </body>
    </html>
  );
}
