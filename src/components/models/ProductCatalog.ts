import { IProduct } from "../../types/index";
import { IEvents } from "../base/Events";

export class ProductCatalog {
    protected products: IProduct[];
    protected selectedProduct: IProduct | null;

    constructor(protected events: IEvents) {
        this.products = [];
        this.selectedProduct = null;
    }

    saveProducts(products: IProduct[]) {
        this.products = products;
        this.events.emit('card-catalog:changed');
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductByID(id: string): IProduct | undefined {
        return this.products.find((product) => product.id === id);
    }

    saveProduct(product: IProduct) {
        this.selectedProduct = product;
        this.events.emit("product:selected", product);
    }

    getProduct(): IProduct | null {
        return this.selectedProduct;
    }
}
