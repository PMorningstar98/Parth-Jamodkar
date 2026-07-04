import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import site from '@/data/site.json';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jbMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jbmono',
  display: 'swap',
  weight: ['400', '500', '700', '800'],
});

const siteUrl = 'https://parthjamodkar.com';
const title = `${site.name} — Threat Hunter & Security Researcher`;
const description = `${site.name} is a threat hunter, security researcher, and detection engineer working across Microsoft Defender XDR, cloud security, threat intelligence, and AI security. ${site.tagline}`;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description,
  keywords: [
    'Parth Jamodkar',
    'Parth Jamodkar Microsoft',
    'Parth Jamodkar Threat Hunter',
    'Parth Jamodkar Security Researcher',
    'Parth Jamodkar GitHub',
    'Parth Jamodkar Microsoft Security',
    'Threat Hunting',
    'Detection Engineering',
    'Microsoft Defender XDR',
    'MITRE ATT&CK',
  ],
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  openGraph: {
    type: 'website',
    url: siteUrl,
    title,
    description,
    siteName: `${site.name} — Research`,
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: siteUrl,
    types: {
      'application/rss+xml': `${siteUrl}/rss.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jbMono.variable} dark`}>
      <body className="min-h-screen bg-void font-sans text-ink antialiased selection:bg-signal-blue/30">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-dot-grid opacity-60" />
        <Header />
        <main className="mx-auto min-h-[70vh] max-w-6xl px-5 pb-24 pt-28 sm:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
