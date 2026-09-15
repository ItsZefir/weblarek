import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";


interface ISuccess {
  total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
  protected orderButton: HTMLButtonElement;
  protected totalElement: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this.orderButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
    this.totalElement = ensureElement<HTMLElement>('.order-success__description', this.container);

    if (actions?.onClick) {
      this.orderButton.addEventListener('click', actions.onClick);
    }
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${value} синапсов`;
  }
}
