import { BaseApi } from '@/utils/baseApi';
import { ITheme, IThemeResponse } from '../interfaces/theme';

class ThemeService extends BaseApi<IThemeResponse, ITheme> {
  constructor() {
    super('/themes');
  }
}

export const themeService = new ThemeService();
