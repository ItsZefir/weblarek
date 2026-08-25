export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}
export type TPayment = 'cash' | 'card';

export interface IApiProductsResponse {
    items: IProduct[];
    total: number;
}

export interface IOrderData {
    payment: string;
    email: string;
    phone: string;
    address: string;
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IApi {
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object): Promise<T>;
}
