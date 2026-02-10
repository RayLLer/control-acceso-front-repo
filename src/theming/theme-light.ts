import { ThemeConfig } from 'antd';
import { componentsLigth } from './components';

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#700845',
    colorInfo: '#700845',
    colorSuccess: '#12b347',
    colorWarning: '#edb926',
    wireframe: false,
    fontFamily: `'Monserrat', sans-serif`,
  },
  components: componentsLigth,
  algorithm: [],
};
