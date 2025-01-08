export interface IFinalPhrase {
    description?: string;
    percentInitRange?: number;
    percentFinishRange?: number;
    general?: boolean;
}

export interface IFinalPhraseResponse {
    id: number;
    attributes: IFinalPhrase
}

export interface IFinalPhraseForm {
    description: string;
    percentInitRange: number;
    percentFinishRange: number;
    general: boolean;
}