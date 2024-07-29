import { ICategoryResponse } from './question';

export enum TAG {
  INFORMATIC = 'Informática',
}

export interface IThemeResponse {
  id: number;
  attributes: ITheme;
}

export interface ITheme {
  name: string;
  tag: TAG;
  createdAt: string;
  updatedAt: string;
  questions: Questions;
  tests: Tests;
  category_themes: {data?: CategoryThemes[]};
  sub_themes: {data?: SubTheme[]};
  deleted: boolean
}

interface Questions {
  data: QuestionData[];
}

interface QuestionData {
  id: number;
  attributes: QuestionAttributes;
}

interface QuestionAttributes {
  questionText: string;
  correctAnswer: string;
  incorrectAnswer1: string;
  incorrectAnswer2: string;
  incorrectAnswer3: string;
  justificationText: string;
  referencia: string;
  clueText: string | null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface Tests {
  data: TestData[];
}

interface TestData {
  id: number;
  attributes: TestAttributes;
}

interface TestAttributes {
  name: string;
  testType: string;
  suTestType: string;
  practicCaseText: string;
  timeLimit: number;
  with5050: boolean;
  withClue: boolean;
  withRuleOut: boolean;
  withTwoAnswers: boolean;
  year: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface CategoryThemes {
  id: number;
  attributes: {
    category: {data: ICategoryResponse};
  }
}

interface SubTheme {
  id: number;
  attributes: {
    name: string;
    deleted?: boolean
  };
}