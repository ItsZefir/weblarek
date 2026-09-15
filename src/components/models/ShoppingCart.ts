import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class ShoppingCart {
    protected selectedProducts: IProduct[];

    constructor(protected events: IEvents) {
        this.selectedProducts = [];
    }

    getSelectedProducts(): IProduct[] {
        return this.selectedProducts;
    }

    addSelectedProduct(product: IProduct) {
        this.selectedProducts.push(product);
        this.events.emit('shopping-cart:changed');
    }

    deleteSelectedProduct(id: string) {
        this.selectedProducts = this.selectedProducts.filter(selectedProduct => selectedProduct.id !== id);
        this.events.emit("shopping-cart:changed");
    }

    clearShoppingCart() {
        this.selectedProducts = [];
        this.events.emit("shopping-cart:changed");
    }

    getTotal(): number {
        return this.selectedProducts.reduce((total, selectedProduct) => total + (selectedProduct.price || 0), 0);
    }

    getSelectedProductsAmount(): number {
        return this.selectedProducts.length;
    }

    checkSelectedProduct(id: string): boolean {
        return this.selectedProducts.some(selectedProduct => selectedProduct.id === id);
    }
}
