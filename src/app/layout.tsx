import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
