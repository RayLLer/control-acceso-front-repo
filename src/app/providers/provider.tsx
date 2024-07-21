'use client';
import React, { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store/store';
import { ConfigProvider, theme as antdTheme, ThemeConfig, App } from 'antd';
import es_ES from 'antd/locale/es_ES';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { colors } from '@/theming/colors';
import ThemeConfigProvider from './theme';

dayjs.locale('es');

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ThemeConfigProvider>
        <AntdRegistry>
          <App>
            {children}
          </App>
          </AntdRegistry>
      </ThemeConfigProvider>
    </ReduxProvider>
  );
}
