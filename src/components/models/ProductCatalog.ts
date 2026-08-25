import { IProduct } from '../../types';
export class Products {
    private items: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    setItems(items: IProduct[]): void {
        this.items = items;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getProductById(id: string): IProduct | undefined {
        return this.items.find(product => product.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
};