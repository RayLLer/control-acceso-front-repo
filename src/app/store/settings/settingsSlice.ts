import { ThemeConfig } from 'antd';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { darkTheme } from '@/theming/theme-dark';
import { lightTheme } from '@/theming/theme-light';
import secureStorage from 'react-secure-storage'

const initialState = {
  theme: '',
  config: {} as any,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState, 
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      secureStorage.setItem('theme', action.payload);
      state.config = action.payload === 'dark' ? darkTheme : lightTheme
    },
  },
});

export const { setTheme } = settingsSlice.actions;

export default settingsSlice.reducer