import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.contentElement = ensureElement<HTMLElement>('.modal__content', container);

        this.closeButton.addEventListener('click', () => this.close());
        container.addEventListener('click', (event) => {
            if (event.target === container) {
                this.close();
            }
        });
    }

    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }

    open() {
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
    }
}