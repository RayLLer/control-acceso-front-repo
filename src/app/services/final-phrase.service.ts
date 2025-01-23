import { BaseApi } from '@/utils/baseApi';
import { IFinalPhrase, IFinalPhraseResponse } from '../interfaces/final-phrase';

class FinalPhraseService extends BaseApi<IFinalPhraseResponse, IFinalPhrase> {
    constructor() {
        super('/final-phrases');
    }
}

export const finalPhraseService = new FinalPhraseService();
