import { Form } from "./Form";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

export interface IContactsForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
    protected emailElement: HTMLInputElement;
    protected phoneElement: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.emailElement = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneElement = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        this.emailElement.addEventListener('input', () => {
            events.emit('contacts:changed', {
                field: 'email',
                value: this.emailElement.value,
            });
        });

        this.phoneElement.addEventListener('input', () => {
            events.emit('contacts:changed', {
                field: 'phone',
                value: this.phoneElement.value,
            });
        });
    }

    set email(value: string) {
        this.emailElement.value = value;
    }

    set phone(value: string) {
        this.phoneElement.value = value;
    }
}