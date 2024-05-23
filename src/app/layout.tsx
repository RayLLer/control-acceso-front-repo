import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import {ConfigProvider, ThemeConfig} from 'antd'
import { colors } from '@/theming/colors';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Test Opo',
  description: 'El giro que necesitas',
};

const {colorPrimary, colorBgBase, colorError, colorWarning} = colors

const theme: ThemeConfig = {
  token: {
    colorPrimary,
    colorBgBase,
    colorError,
    colorWarning,
    colorLink: colorPrimary
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ConfigProvider theme={theme}>
          <AntdRegistry>{children}</AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  );
}
