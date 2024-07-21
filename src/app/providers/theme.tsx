import { ConfigProvider, theme as antdTheme } from 'antd';
import React, { useEffect, useMemo } from 'react';
import es_ES from 'antd/locale/es_ES';
import { useAppSelector } from '../store/hooks';
import { darkTheme } from '@/theming/theme-dark';
import { lightTheme } from '@/theming/theme-light';

const ThemeConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useAppSelector((state) => state.settings);
  const config = useMemo(
    () => (theme === 'dark' ? darkTheme : lightTheme),
    [theme]
  );
  return (
    <ConfigProvider
      locale={es_ES}
      theme={{
        ...config,
        algorithm:
          theme === 'dark'
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeConfigProvider;
