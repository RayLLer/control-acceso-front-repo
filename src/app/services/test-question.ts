import { BaseApi } from '@/utils/baseApi';
import { TestQuestion, TestQuestionResponse } from '../interfaces/test';

class TestQuestionService extends BaseApi<TestQuestionResponse, TestQuestion> {
  constructor() {
    super('/test-questions');
  }
}

export const testQuestionService = new TestQuestionService();
