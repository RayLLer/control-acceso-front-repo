import { BaseApi } from '@/utils/baseApi';
import { ITest, ITestResponse } from '../interfaces/test';

class TestService extends BaseApi<ITestResponse, ITest> {
  constructor() {
    super('/tests');
  }
}

export const testService = new TestService();
