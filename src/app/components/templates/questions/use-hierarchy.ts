/* eslint-disable react-hooks/exhaustive-deps */
import { ISelect } from '@/app/interfaces/basics';
import { blockService } from '@/app/services/block.service';
import { categoryService } from '@/app/services/category.service';
import { subThemeService } from '@/app/services/subthemes.service';
import { themeService } from '@/app/services/themes.service';
import { BASE_FILTER } from '@/utils/constants/constants';
import { convertForSelect } from '@/utils/select-utils';
import { message } from 'antd';
import React, { useEffect, useState } from 'react';

export const useHierarchy = (
  category: number,
  theme: number,
  sub_theme?: number
) => {
  const [categories, setCategories] = useState<ISelect[]>([]);
  const [themes, setThemes] = useState<ISelect[]>([]);
  const [subThemes, setSubThemes] = useState<ISelect[]>([]);
  const [blocks, setBlocks] = useState<ISelect[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingThemes, setLoadingThemes] = useState(false);
  const [loadingSubThemes, setLoadingSubThemes] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);

  const fetchCategories = async () => {
    // Fetch categories
    setLoadingCategories(true);
    try {
      const response = await categoryService.getForSelect('name');
      setCategories(convertForSelect(response.data.data));
    } catch (error) {
      message.error('Error al cargar las categorías');
    }
    setLoadingCategories(false);
  };

  const fetchTheme = async () => {
    // Fetch theme
    setLoadingThemes(true);
    try {
      const response = await themeService.getForSelect('name', {
        filters: {
          category_themes: {
            category: { id: { $eq: category } },
          },
          deleted: false, // Excluir temas eliminados
          ...BASE_FILTER
        },
      });
      setThemes(convertForSelect(response.data.data));
    } catch (error) {
      message.error('Error al cargar los temas');
    }

    setLoadingThemes(false);
  };

  const fetchSubTheme = async () => {
    // Fetch subtheme
    setLoadingSubThemes(true);
    try {
      const response = await subThemeService.getForSelect('name', {
        filters: {
          theme: {
            id: { $eq: theme },
          },
          ...BASE_FILTER
        },
      });
      setSubThemes(convertForSelect(response.data.data));
    } catch (error) {
      message.error('Error al cargar los subtemas');
    }
    setLoadingSubThemes(false);
  };

  const fetchBlock = async () => {
    // Fetch block
    setLoadingBlocks(true);
    try {
      const response = await blockService.getForSelect('name', {
        filters: {
          sub_theme: {
            id: { $eq: sub_theme },
          },
        },
      });
      setBlocks(convertForSelect(response.data.data));
    } catch (error) {
      message.error('Error al cargar los bloques');
    }
    setLoadingBlocks(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (category) {
      setThemes([]);
      setSubThemes([]);
      setBlocks([]);
      fetchTheme();
    }
  }, [category]);

  useEffect(() => {
    theme && fetchSubTheme();
  }, [theme]);

  useEffect(() => {
    sub_theme && fetchBlock();
  }, [sub_theme]);

  return {
    categories,
    themes,
    subThemes,
    blocks,
    loadingCategories,
    loadingThemes,
    loadingSubThemes,
    loadingBlocks,
  };
};
