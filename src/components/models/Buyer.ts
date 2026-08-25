import { IBuyer, TPayment } from '../../types';
export class Buyer {
  private data: Partial<IBuyer> = {};

  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    this.data[field] = value;
  }
  getData(): IBuyer { return this.data as IBuyer; }
  clear(): void { this.data = {}; }
  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    if (!this.data.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.data.email) errors.email = 'Укажите email';
    if (!this.data.phone) errors.phone = 'Укажите телефон';
    if (!this.data.address) errors.address = 'Укажите адрес';
    return errors;
  }
}