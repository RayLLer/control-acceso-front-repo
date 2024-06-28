import { BaseApi } from '@/utils/baseApi';
import { ICategory, ICategoryResponse } from '../interfaces/question';

class CategoryThemeService extends BaseApi<any, any> {
  constructor() {
    super('/category-themes');
  }
}

export const categoryThemeService = new CategoryThemeService();
