import { BaseApi } from '@/utils/baseApi';


class RealizedTestService extends BaseApi<any, any> {
  constructor() {
    super('/realized-tests')
  }
}

export const realizedTestService = new RealizedTestService();