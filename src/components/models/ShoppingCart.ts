import { IProduct } from '../../types';
export class Basket {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        this.items.push(product);
    }

    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
    }

    clear(): void {
        this.items = [];
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + (item.price || 0), 0);
    }
    getTotalQuantity(): number {
        return this.items.length;
    }
    hasProduct(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}