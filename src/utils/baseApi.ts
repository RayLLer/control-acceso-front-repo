import { StrapiResponse } from '@/app/interfaces/strapi';
import { axiosInstance } from './axios';
import { convertParams } from './table';

export class BaseApi<T, R> {
  public url: string;
  constructor(url: string) {
    this.url = url;
  }

  get(params?: any) {
    const convertedParams = params ? convertParams(params) : undefined;
    return axiosInstance.get<StrapiResponse<T>>(this.url, {
      params: {
        populate: '*',
        sort: [{ createdAt: 'desc' }],
        ...convertedParams,
      },
    });
  }

  getForSelect(labelAttr: string, params?: any) {
    const convertedParams = params ? convertParams(params) : undefined;
    return axiosInstance.get<StrapiResponse<T>>(this.url, {
      params: {
        fields: {
          0: labelAttr,
        },
        _limit: -1,
        ...convertedParams,
        populate: undefined
      },
    });
  }

  count() {
    return axiosInstance.get<any>(`${this.url}/count`);
  }

  getById(id: number, params?: any) {
    return axiosInstance.get<{ data: T }>(`${this.url}/${id}`, {
      params: { populate: '*', ...params },
    });
  }

  post(body: R) {
    return axiosInstance.post<{ data: T }>(this.url, { data: body });
  }

  patch(id: number, body: R) {
    return axiosInstance.patch<{ data: T }>(`${this.url}/${id}`, {
      data: body,
    });
  }

  put(id: number, body: R) {
    return axiosInstance.put<{ data: T }>(`${this.url}/${id}`, { data: body });
  }

  delete(id: number) {
    return axiosInstance.delete<{ data: T }>(`${this.url}/${id}`);
  }
}
