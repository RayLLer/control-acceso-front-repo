import { IUserResponse } from '../pages/users/users.interface';
import { IQuestionResponse } from './question';

export interface IErrorReportResponse {
  id: number;
  attributes: IErrorReport;
}

export interface IErrorReport {
  answer: string;
  date: Date;
  question: { data?: IQuestionResponse };
  selectedCause: string;
  state: string;
  textError: string;
  createdAt: Date;
  updatedAt: Date;
  users_permissions_user: { data?: IUserResponse };
}