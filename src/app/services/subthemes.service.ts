import { BaseApi } from '@/utils/baseApi';
import { ISubTheme, ISubThemeResponse } from '../interfaces/question';
import { CategoryThemes } from '../interfaces/theme';

class SubThemeService extends BaseApi<ISubThemeResponse, ISubTheme> {
  constructor() {
    super('/sub-themes');
  }
  async fetchSubThemesWithThemesAndCategories() {
    const response = await this.get({
      fields: ['name'],
      filters: {
        deleted: false, // Excluir temas eliminados
      },
      populate: {
        theme: {
          populate: {
            category_themes: {
              populate: { category: true },
            },
          },
        },
      },
    });

    // Extraer y formatear los nombres de las categorías
    const categories = (array: CategoryThemes[]): string => {
      return array
        .map((item) => item.attributes.category.data.attributes.name)
        .join(', ');
    };

    // Formatear el resultado para Select
    return response.data.data.map((subtheme) => ({
      label: `${subtheme.attributes.name}, Tema: ${subtheme.attributes.theme.data.attributes.name}, Categoría(s): ${categories(subtheme.attributes.theme.data.attributes.category_themes.data ?? [])}`,
      value: subtheme.id,
    }));
  }
}

export const subThemeService = new SubThemeService();
