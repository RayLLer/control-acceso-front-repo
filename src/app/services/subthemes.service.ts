import { BaseApi } from '@/utils/baseApi';
import { ISubTheme, ISubThemeResponse } from '../interfaces/question';

class SubThemeService extends BaseApi<ISubThemeResponse, ISubTheme> {
  constructor() {
    super('/sub-themes');
  }
}

export const subThemeService = new SubThemeService();
