import { IQuestionResponse } from './question';

export interface ITestResponse {
  id: number;
  attributes: ITest;
}

export interface ITest {
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
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  oposition: Category;
  category: Category;
  theme: Category;
  test: Test;
  test_questions: TestQuestions;
  realized_tests: RealizedTests;
  users_permissions_user: UsersPermissionsUser;
}

export interface Category {
  data: CategoryData;
}

export interface CategoryData {
  id: number;
  attributes: PurpleAttributes;
}

export interface PurpleAttributes {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  tag?: null;
}

export interface RealizedTests {
  data: RealizedTestsDatum[];
}

export interface RealizedTestsDatum {
  id: number;
  attributes: FluffyAttributes;
}

export interface FluffyAttributes {
  initDate: Date;
  finishDate: null;
  correctAnswersQty: number;
  incorrectAnswersQty: number;
  blanckAnswersQty: number;
  doubtAnswersQty: number;
  evaluationPercent: number;
  duration: number;
  qty5050used: number;
  qtyClueused: number;
  qtyRuleOutused: number;
  qtyTwoAnswersused: number;
  saved: boolean;
  savedDate: null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  calification: number;
  combinedCalification: number;
}

export interface Test {
  data: TestData;
}

export interface TestData {
  id: number;
  attributes: TentacledAttributes;
}

export interface TentacledAttributes {
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
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}

export interface TestQuestions {
  data: TestQuestionResponse[];
}

export interface TestQuestionResponse {
  id: number;
  attributes: DatumAttributes;
}
export interface DatumAttributes {
  order: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  question: Question;
}

export interface Question {
  data: IQuestionResponse;
}

export interface UsersPermissionsUser {
  data: UsersPermissionsUserData;
}

export interface UsersPermissionsUserData {
  id: number;
  attributes: IndigoAttributes;
}

export interface IndigoAttributes {
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  name: null;
  createdAt: Date;
  updatedAt: Date;
}
