import { BaseApi } from '@/utils/baseApi';
import { ITheme, IThemeResponse, CategoryThemes } from '../interfaces/theme';

class ThemeService extends BaseApi<IThemeResponse, ITheme> {
  constructor() {
    super('/themes');
  }

  async fetchThemesWithCategories() {
    const response = await this.get({
      fields: ['name'],
      filters: {
        deleted: false, // Excluir temas eliminados
      },
      populate: {
        category_themes: {
          populate: { category: true },
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
    return response.data.data.map((theme) => ({
      label: `${theme.attributes.name}: ${categories(theme.attributes.category_themes.data ?? [])}`,
      value: theme.id,
    }));
  }
}

export const themeService = new ThemeService();
