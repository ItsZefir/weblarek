import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  items: HTMLElement[];
  price: number;
}

export class Basket extends Component<IBasket> {
    protected placeButton: HTMLButtonElement;
    protected priceElement: HTMLElement;
    protected basketListElement: HTMLElement;


  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.basketListElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.placeButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);

    this.placeButton.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set items(value: HTMLElement[]) {
    this.basketListElement.innerHTML = '';
    if (value.length === 0) {
      this.basketListElement.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
    } else {
      this.basketListElement.append(...value);
    }
  }

  set price(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  setPurchaseOpportunity(isEmpty: boolean) {
    this.placeButton.disabled = isEmpty;
    this.placeButton.classList.toggle('button_disabled', isEmpty);
  }
}
