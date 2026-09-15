import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";


export interface IForm {
  valid: boolean;
    address?: string;
    email?: string;
    phone?: string;
    payment?: string;
  errors: string[];

}

export class Form extends Component<IForm> {
  protected formElement: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLElement;

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);
    
    this.formElement = container;
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorsContainer = ensureElement<HTMLElement>('.form__errors', this.container);

    this.submitButton.disabled = true;
    this.submitButton.classList.add('button_disabled');

    this.formElement.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      if (!this.submitButton.disabled) {
        this.events.emit(`${this.formElement.name}:submit`);
      }
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
    this.submitButton.classList.toggle('button_disabled', !value);
  }

  set errors(value: string[]) {
    this.errorsContainer.textContent = value.join(', ');
  }
}
