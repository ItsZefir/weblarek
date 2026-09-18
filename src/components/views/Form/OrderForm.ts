import { Form } from "./Form";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { TPayment } from "../../../types";

export interface IOrderForm {
    payment: TPayment;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressElement: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.paymentButtons = Array.from(container.querySelectorAll('button[name]'));
        this.addressElement = ensureElement<HTMLInputElement>('input[name="address"]', container);

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', () => {
                events.emit('order:changed', {
                    field: 'payment',
                    value: button.name,
                });
            });
        });

        this.addressElement.addEventListener('input', () => {
            events.emit('order:changed', {
                field: 'address',
                value: this.addressElement.value,
            });
        });
    }

    set address(value: string) {
        this.addressElement.value = value;
    }

    set payment(value: TPayment) {
        this.paymentButtons.forEach((button) => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }
}