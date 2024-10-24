import { axiosInstance } from '@/utils/axios';
import { BaseApi } from '@/utils/baseApi';
import { IGeneralConfig, IGeneralConfigResponse } from '../interfaces/general-data';

class GeneralConfigServices extends BaseApi<IGeneralConfigResponse, IGeneralConfig> {
    constructor() {
        super('/configuration');
    }
    getGeneralConfig() {
        return axiosInstance.get<{ data: IGeneralConfigResponse }>(this.url);
    }
    patchGeneralData(body: IGeneralConfig) {
        return axiosInstance.put<{ data: IGeneralConfigResponse }>(this.url, { data: body });
    }
}

export const generalConfigServices = new GeneralConfigServices();
