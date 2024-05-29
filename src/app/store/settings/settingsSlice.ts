import { ThemeConfig } from 'antd';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { darkTheme } from '@/theming/theme-dark';
import { lightTheme } from '@/theming/theme-light';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const initialState = {
  theme: 'light' as 'light' | 'dark',
  config: lightTheme as any
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState, 
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      state.config = action.payload === 'dark' ? darkTheme : lightTheme
    },
  },
});

export const { setTheme } = settingsSlice.actions;

const persistConfig = {
  key: 'settings',
  storage
}

const persitedSettingsSlice = persistReducer(persistConfig, settingsSlice.reducer);

export default persitedSettingsSlice