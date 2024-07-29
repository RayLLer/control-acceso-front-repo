export interface IQuestionResponse {
  id: number;
  attributes: IQuestion;
}

export interface IQuestion {
  questionText: string;
  correctAnswer: string;
  image: any; //TODO: Change to image interface
  incorrectAnswer1: string;
  incorrectAnswer2: string;
  incorrectAnswer3: string;
  justificationText: string;
  referencia: string;
  clueText: string;
  category: {data: ICategoryResponse};
  theme: {data: IThemeResponse}; //TODO: Change to theme interface
  sub_theme: {data: ISubThemeResponse}; //TODO: Change to sub_theme interface
  deleted: boolean;
  test_questions: any; //TODO: Change to test_question interface
  realized_questions: any; //TODO: Change to test_question interface
  error_reports: any; //TODO: Change to test_question interface
  retired_questions: any; //TODO: Change to test_question interface
  block: {data: IBlockResponse}; //TODO: Change to block interface
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

export interface IQuestionForm {
  questionText: string;
  correctAnswer: string;
  image: any; //TODO: Change to image interface
  incorrectAnswer1: string;
  incorrectAnswer2: string;
  incorrectAnswer3: string;
  justificationText: string;
  referencia: string;
  clueText: string;
  category: number;
  theme: number; //TODO: Change to theme interface
  sub_theme: number; //TODO: Change to sub_theme interface
  deleted: boolean;
  test_questions: number; //TODO: Change to test_question interface
  realized_questions: any; //TODO: Change to test_question interface
  error_reports: any; //TODO: Change to test_question interface
  retired_questions: any; //TODO: Change to test_question interface
  block: number; //TODO: Change to block interface
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

export interface ICategoryResponse {
  id: number
  attributes: ICategory
}

export interface ICategory {
  name: string
}

export interface IThemeResponse {
  id: number;
  attributes: ITheme;
}

export interface ITheme {
  name: string;
  deleted: boolean;
}

export interface ISubThemeResponse {
  id: number;
  attributes: ISubTheme;
}

export interface ISubTheme {
  name: string;
  theme: { data: IThemeResponse };
  blocks: { data?: IBlockResponse[] };
  deleted: boolean;
}

export interface IBlockResponse {
  id: number;
  attributes: IBlock;
}

export interface IBlock {
  name: string;
  sub_theme: {data: ISubThemeResponse};
  deleted: boolean;
}

