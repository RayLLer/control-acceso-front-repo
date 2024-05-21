import { BaseApi } from '@/utils/baseApi';
import { axiosInstance } from '@/utils/axios';
import IBaseRest from '@/utils/base.interface';
import { IPermissions, IRole, IRoutesInfo } from './roles.interface';

export class RolesServices extends BaseApi<IRole, IRole> {
  constructor() {
    super('/roles');
  }
  getRoles(url: string, params: { [key: string]: any }) {
    return axiosInstance.get<{ roles: IRole[] }>(url, {
      params: { ...params, populate: '*' },
    });
  }

  getRoleById(url: string, id: number, params?: any) {
    return axiosInstance.get<{ role: IRole }>(`${url}/${id}`);
  }
  filter(url: string, params?: any) {
    return axiosInstance.get<{ role: IRole }>(`${url}`, {
      params,
    });
  }

  getPermissions(url: string) {
    return axiosInstance.get<IBaseRest<IPermissions>>(url);
  }
  getPermissionsByRoleID(url: string, id) {
    return axiosInstance.get(`${url}/${id}`);
  }

  updatePermissions(
    url: string,
    payload: {
      roleId: number;
      customPermissionsIds: Array<number>;
    }
  ) {
    return axiosInstance.post(url, payload);
  }
}
