import { ThemeConfig } from 'antd';
import { componentsLigth } from './components';

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary: '#c1301d',
    colorInfo: '#c1301d',
    colorSuccess: '#12b347',
    colorWarning: '#edb926',
    wireframe: false,
    fontFamily: `'Monserrat', sans-serif`,
  },
  components: componentsLigth,
  algorithm: [],
};
