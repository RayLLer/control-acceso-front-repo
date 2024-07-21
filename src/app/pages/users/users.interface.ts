import { IRole } from '../roles/roles.interface';

type ID = {id: number}
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
  name?: string;
  phone?: string;
  identityCard: string;
  client: any
}
