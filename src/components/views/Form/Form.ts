import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IForm {
    valid: boolean;
    errors: string[];
}

export abstract class Form<T> extends Component<IForm & T> {
    protected submitButton: HTMLButtonElement;
    protected errorsContainer: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorsContainer = ensureElement<HTMLElement>('.form__errors', container);

        container.addEventListener('submit', (event: Event) => {
            event.preventDefault();
            this.events.emit(`${container.name}:submit`);
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