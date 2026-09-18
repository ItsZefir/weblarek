import { categoryMap, CDN_URL } from "../../../utils/constants";
import { IProduct } from "../../../types";
import { Card } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

type CategoryKey = keyof typeof categoryMap;

export type TCardPreview = Pick<IProduct, 'image' | 'category' | 'description'> & {
    title: string;
    price: number | null;
    disabled: boolean;
    buttonText: string;
};

export class CardPreview extends Card<TCardPreview> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected descriptionElement: HTMLElement;
    protected cardButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.cardButton.addEventListener('click', () => this.events.emit('card:action'));
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
        this.setImage(this.imageElement, `${CDN_URL}/${value.replace(/\.[^.]+$/, '.png')}`, title);
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set disabled(value: boolean) {
        this.cardButton.disabled = value;
        this.cardButton.classList.toggle('button_disabled', value);
    }

    set buttonText(value: string) {
        this.cardButton.textContent = value;
    }
}