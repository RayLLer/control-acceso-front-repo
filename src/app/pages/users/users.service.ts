import { BaseApi } from '@/utils/baseApi';
import { IUser } from './users.interface';
import { axiosInstance } from '@/utils/axios';

export class UsersService extends BaseApi<IUser, IUser> {
  constructor() {
    super('/users');
  }
  getUsers(url: string, params: { [key: string]: any }) {
    return axiosInstance.get<IUser[]>(url, {
      params: { ...params, populate: '*' },
    });
  }
  getUserById(url: string, params: { [key: string]: any }) {
    return axiosInstance.get<IUser[]>(url, {
      params: { ...params, populate: '*' },
    });
  }

  getLoggedUser(url: string) {
    return axiosInstance.get<IUser>(url, {
      params: { populate: 'role' },
    });
  }
  putLoggedUser(url: string, body: IUser) {
    return axiosInstance.put<IUser>(url, body);
  }
  putUser(id: number, body: IUser) {
    return axiosInstance.put<IUser>(`${this.url}/${id}`, body);
  }
  postUser(body: IUser) {
    return axiosInstance.post<IUser>(this.url, body);
  }
}

export const userService = new UsersService()
