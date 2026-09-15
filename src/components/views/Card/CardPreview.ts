import { categoryMap, CDN_URL } from "../../../utils/constants";
import { IProduct } from "../../../types";
import { Card } from "./Card";
import { ensureElement } from "../../../utils/utils";

type CategoryKey = keyof typeof categoryMap;
export type TCardPreview = Pick<IProduct, 'image' | 'category' | 'description'> & {
    title: string;
    price: number | null;
    product: IProduct;
};

export interface ICardActions {
    onClick?: (event: MouseEvent) => void;
    onButtonClick?: (product: IProduct) => void;
}

export class CardPreview extends Card<TCardPreview> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected descriptionElement: HTMLElement;
    protected cardButton: HTMLButtonElement;
    private currentProduct: IProduct | null = null;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
        if (!this.cardButton) {
            console.error('Card button not found in container');
            return;
        }
        if (actions?.onButtonClick) {
            this.cardButton.addEventListener('click', () => {
                console.log('Card button clicked, currentProduct:', this.currentProduct);
                if (this.currentProduct) {
                    actions.onButtonClick?.(this.currentProduct);
                } else {
                    console.warn('No current product to add to cart');
                }
            });
            console.log('Event listener added to card button');
        } else {
            console.warn('No onButtonClick handler provided');
        }
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        for (const key in categoryMap) {
            this.categoryElement.classList.toggle(
                categoryMap[key as CategoryKey],
                key === value
            );
        }
    }

    set image(value: string) {
        const title = this.titleElement.textContent ?? '';
        this.setImage(
            this.imageElement,
            CDN_URL + value.slice(0, -3) + 'png',
            title
        );
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set disabled(value: boolean) {
        this.cardButton.disabled = value;
        this.cardButton.classList.toggle('button_disabled', value);
    }

    set cardButtonText(value: string) {
        this.cardButton.textContent = value;
    }

    render(data?: Partial<TCardPreview>): HTMLElement {
        if (!data) return this.container;
        if (data.product) {
            this.currentProduct = data.product;
            console.log('Current product set in CardPreview:', this.currentProduct.id);
        }
        if (data.title !== undefined) {
            this.title = data.title;
        }
        if (data.price !== undefined) {
            this.price = data.price;
        }
        if (data.category !== undefined) {
            this.category = data.category;
        }
        if (data.image !== undefined) {
            this.image = data.image;
        }
        if (data.description !== undefined) {
            this.description = data.description;
        }

        return this.container;
    }

    getProduct(): IProduct | null {
        return this.currentProduct;
    }

    destroy(): void {
        this.container.innerHTML = '';
        this.currentProduct = null;
    }
}
