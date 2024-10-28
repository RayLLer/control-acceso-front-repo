import { IUser } from "../pages/users/users.interface";
import { ITestResponse } from "./test";

export interface IRealizedTestAttemptsResponse {
  users_permissions_user: User;
  id: number;
  themes: string;
  initDate: Date;
  finishDate: Date;
  evaluationPercent: number;
  calification: number;
  combinedCalification: number;
  completeTest: number;
  test: Test;
  attempts: number;
}

export interface LastTest { }

export interface Test {
  id: number;
  name: string;
  theme: Theme;
}

export interface Theme {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
}

export interface IRealizedTestResponse {
  id: number;
  attributes: IRealizedTest2;
}

export interface IRealizedTest2 {
  id: number;
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
  completeTest: null;
  test: { data?: ITestResponse };
  realized_questions: { data?: IRealizedQuestionsResponse[] };
  users_permissions_user: { data?: { id: number; attributes: IUser } };
  attempts: number;
  themes?: string
}

export interface IRealizedTest {
  id: number;
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
  completeTest: null;
  test: ITestResponse;
  realized_questions: IRealizedQuestionsResponse[];
  users_permissions_user: IUser;
  attempts: number;
}

export interface IRealizedQuestionsResponse {
  id: number;
  attributes: IRealizedQuestions;
}

export interface IRealizedQuestions {
  correct: number;
  withDoubts: boolean;
  givenAnswer1: string;
  givenAnswer2: string;
  with5050: boolean;
  withClue: boolean;
  withRuleOut: boolean;
  withTwoAnswers: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
}
