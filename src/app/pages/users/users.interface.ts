import { IRole } from '../roles/roles.interface';

type ID = { id: number }
export interface IUser {
  username: string;
  password?: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: IRole;
  name?: string;
  phone?: string;
  foto?: any;
  identityCard: string;
  client: any
}

export interface IUserResponse {
  id: number;
  attributes: IUser;
}

export interface IUserPlane extends IUser {
  id: number;
}
