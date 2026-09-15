import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

export class OrderForm extends Form {
  protected paymentButtons: HTMLButtonElement[];
  protected addressElement: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.paymentButtons = Array.from(this.container.querySelectorAll('button[name]'));
    this.addressElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    
    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        events.emit('order:changed', { 
          field: 'payment', 
          value: button.getAttribute('name') || '' 
        });
      });
    });
    
    this.addressElement.addEventListener('input', () => {
      events.emit('order:changed', { 
        field: 'address', 
        value: this.addressElement.value 
      });
    });
  }

  set payment(value: string) {
    this.paymentButtons.forEach(btn => {
      btn.classList.toggle('button_alt-active', btn.getAttribute('name') === value);
    });
  }

  set address(value: string) {
    this.addressElement.value = value;
  }
}
