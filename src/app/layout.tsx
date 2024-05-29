import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import React from 'react';
import './globals.css';
import Providers from './providers/provider';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Test Opo',
  description: 'El giro que necesitas',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang='en'>
      <body style={{margin: 0 }} >
          <Providers>{children}</Providers>
      </body>
    </html>
  );
}
