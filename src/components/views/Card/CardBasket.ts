import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";

export type TCardBasket = {
    index?: number;
};

export class CardBasket extends Card<TCardBasket> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected onDelete: () => void) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        this.deleteButton.addEventListener('click', () => {
            this.onDelete();
        });
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}