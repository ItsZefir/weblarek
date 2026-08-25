export class AppApi {
  constructor(private api: IApi) {}

  getProducts(): Promise<IProduct[]> {
    return this.api.get('/product/').then((data: { items: IProduct[] }) => data.items);
  }

  postOrder(order: IOrderData): Promise<IOrderResult> {
    return this.api.post('/order/', order);
  }
}