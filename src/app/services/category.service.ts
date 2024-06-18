import { BaseApi } from '@/utils/baseApi';
import { ICategory, ICategoryResponse } from '../interfaces/question';

class CategoryService extends BaseApi<ICategoryResponse, ICategory> {
  constructor() {
    super('/categories');
  }
}

export const categoryService = new CategoryService();
