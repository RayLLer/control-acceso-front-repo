import { BaseApi } from '@/utils/baseApi';
import { IQuestion, IQuestionResponse } from '../interfaces/question';

class QuestionService extends BaseApi<IQuestionResponse, IQuestion> {
  constructor() {
    super('/questions');
  }
}

export const questionService = new QuestionService();
