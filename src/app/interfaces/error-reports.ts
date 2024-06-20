import { IUser } from '../pages/users/users.interface';
import { IQuestionResponse } from './question';

export interface IErrorReportResponse {
  id: number;
  attributes: IErrorReport;
}

export interface IErrorReport {
  date: Date;
  selectedCause: string;
  textError: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  question: {data?: IQuestionResponse};
  users_permissions_user: IUser;
}