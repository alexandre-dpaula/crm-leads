import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/layout/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FlowCRM',
  description: 'CRM minimalista para times modernos focados em produtividade.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
