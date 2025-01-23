import { BaseApi } from '@/utils/baseApi';
import { ITip, ITipResponse } from '../interfaces/tip';

class TipService extends BaseApi<ITipResponse, ITip> {
    constructor() {
        super('/tips');
    }
}

export const tipService = new TipService();
