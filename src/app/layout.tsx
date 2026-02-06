import type { Metadata } from 'next';
import { Source_Sans_3, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const sans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'AAVE V3 Liquidation Monitor',
  description: 'Real-time monitoring of AAVE V3 lending positions and liquidation risks on Ethereum Mainnet',
  keywords: ['AAVE', 'DeFi', 'Liquidation', 'Ethereum', 'Monitoring'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable} font-sans`}>{children}</body>
    </html>
  );
}
