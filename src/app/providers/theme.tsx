import { ConfigProvider, theme as antdTheme } from 'antd';
import React, { useEffect } from 'react'
import es_ES from 'antd/locale/es_ES';
import { useAppSelector } from '../store/hooks';

const ThemeConfigProvider = ({children}: {children: React.ReactNode}) => {
  const {theme, config} = useAppSelector((state) => state.settings);
useEffect(() => {
  console.log(theme);
}, [theme]);
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
}

export default ThemeConfigProvider