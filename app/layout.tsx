import type { Metadata } from 'next';
import { DM_Mono, Fraunces } from 'next/font/google';
import { Nav } from '@/components/Nav';
import { ThemeProvider } from '@/lib/theme';
import './globals.css';

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
});

const fraunces = Fraunces({
  weight: ['300', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Fountain Vitality — Clinical Ops',
  description: 'Monthly clinical operations reporting dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmMono.variable} ${fraunces.variable}`}>
      <body>
        <ThemeProvider>
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
