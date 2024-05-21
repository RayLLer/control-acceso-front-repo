import { IDriver, IDriverResponse } from '@/app/interfaces/driver';
import { IOfficial, IOfficialResponse } from '@/app/interfaces/official';
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
  fullName?: string;
  phone?: string;
  identityCard: string;
  client: any
  driver : IDriver & ID
  official: IOfficial & ID
}
