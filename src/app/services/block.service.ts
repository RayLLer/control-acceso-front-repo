import { BaseApi } from '@/utils/baseApi';
import { IBlock, IBlockResponse, ISubTheme, ISubThemeResponse } from '../interfaces/question';

class BlockService extends BaseApi<IBlockResponse, IBlock> {
  constructor() {
    super('/blocks');
  }
}

export const blockService = new BlockService();
