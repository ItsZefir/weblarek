import { IBuyer, TPayment, IBuyerValidationErrors } from "../../types/index";
import { IEvents } from "../base/Events";

export class Buyer {
    protected data: IBuyer;
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
        this.data = {
            payment: "",
            address: "",
            email: "",
            phone: "",
        };
    }

    savePaymentType(payment: TPayment) {
        this.data.payment = payment;
        this.events.emit('buyer-data:changed', { field: 'payment' });
    }

    saveAddress(address: string) {
        this.data.address = address;
        this.events.emit('buyer-data:changed', { field: 'address' });
    }

    saveEmail(email: string) {
        this.data.email = email;
        this.events.emit('buyer-data:changed', { field: 'email' });
    }

    savePhone(phone: string) {
        this.data.phone = phone;
        this.events.emit('buyer-data:changed', { field: 'phone' });
    }

    getData(): IBuyer {
        return this.data;
    }

    clearBuyerData() {
        this.data = {
            payment: "",
            address: "",
            email: "",
            phone: "",
        };
        this.events.emit('buyer-data:changed');
    }

    validate(): IBuyerValidationErrors {
        const errors: IBuyerValidationErrors = {
            payment: "",
            address: "",
            email: "",
            phone: "",
        };

        if (!this.data.payment.trim()) {
            errors.payment = "Выберите вид оплаты";
        }
        if (!this.data.address.trim()) {
            errors.address = "Не указан адрес";
        }
        if (!this.data.phone.trim()) {
            errors.phone = "Не указан телефон";
        }
        if (!this.data.email.trim()) {
            errors.email = "Не указан email";
        }

        return errors;
    }
}