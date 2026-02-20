export interface IPromo {
    texto: string;
}

export interface IPromoResponse {
    id?: number;
    texto?: string;
    attributes?: IPromo;
}