import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Compiler Design in a Day — Anna University B.E. CSE Sem V (24CS5501)',
  description:
    'A focused, calm, 1-day comprehensive study guide and interactive laboratory for Anna University Compiler Design (24CS5501).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen selection:bg-[var(--accent-soft)] selection:text-[var(--accent)]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
