import { IRole } from './role';

export interface IUser {
  id: number;
  username: string;
  password?: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: IRole;
  lastName?: string;
  name?: string;
  phone?: string;
}
