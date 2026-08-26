import { IBuyer, TPayment } from '../../types';

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export class Buyer {
  private data: Partial<IBuyer> = {};

  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    this.data[field] = value;
  }
  getData(): Partial<IBuyer> {
    return this.data;
  }
  clear(): void {
    this.data = {};
  }
  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};
    if (!this.data.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.data.email) errors.email = 'Укажите email';
    if (!this.data.phone) errors.phone = 'Укажите телефон';
    if (!this.data.address) errors.address = 'Укажите адрес';
    return errors;
  }
  isComplete(): boolean {
    return !!(this.data.payment && this.data.email && this.data.phone && this.data.address);
  }
  getCompleteData(): IBuyer | null {
    if (this.isComplete()) {
      return this.data as IBuyer;
    }
    return null;
  }
}