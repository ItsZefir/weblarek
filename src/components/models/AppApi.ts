import { IApi, IProduct, IOrderData, IOrderResult } from '../../types';

export interface IGetProductsResponse {
    items: IProduct[];
    total: number;
}

export class AppApi {
    constructor(private api: IApi) {}

    getProducts(): Promise<IGetProductsResponse> {
        return this.api.get<IGetProductsResponse>('/product/');
    }

    postOrder(order: IOrderData): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order/', order);
    }
}

/* спасибо за проверку и такие комментарии, это был очень ценный опыт */