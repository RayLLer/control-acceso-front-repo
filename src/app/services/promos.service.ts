import { axiosInstance } from '@/utils/axios';
import { BaseApi } from '@/utils/baseApi';
import { IPromo, IPromoResponse } from '../interfaces/promo-data';

class PromoServices extends BaseApi<IPromoResponse, IPromo> {
    constructor() {
        super('/promo');
    }
    getPromos() {
        return axiosInstance.get<{ data: IPromoResponse }>(this.url);
    }
    patchPromos(body: IPromo) {
        return axiosInstance.put<{ data: IPromoResponse }>(this.url, { data: body });
    }
}

export const promoServices = new PromoServices();