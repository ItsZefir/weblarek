import './scss/styles.scss';
import { Products } from './components/models/Products';
import { Basket } from './components/models/ShoppingCart';
import { Buyer } from './components/models/Buyer';
import { AppApi } from './components/models/AppApi';
import { Api } from './components/base/api';
import { apiProducts } from './utils/data';

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();
const appApi = new AppApi(new Api('https://example.com/api/'));

productsModel.setItems(apiProducts.items);
console.log('Каталог (все товары):', productsModel.getItems());
console.log('Товар по id:', productsModel.getProductById(apiProducts.items[0].id));

const selectedProduct = productsModel.getItems()[0];
productsModel.setSelectedProduct(selectedProduct);
console.log('Выбранный товар:', productsModel.getSelectedProduct());
basketModel.addItem(productsModel.getItems()[0]);
basketModel.addItem(productsModel.getItems()[1]);
console.log('Корзина (все товары):', basketModel.getItems());
console.log('Количество товаров в корзине:', basketModel.getTotalQuantity());
console.log('Общая стоимость корзины:', basketModel.getTotalPrice());
console.log('Есть ли товар в корзине:', basketModel.hasProduct(productsModel.getItems()[0].id));

basketModel.removeItem(productsModel.getItems()[0].id);
console.log('Корзина после удаления товара:', basketModel.getItems());
buyerModel.setField('payment', 'card');
buyerModel.setField('email', 'test@test.com');
buyerModel.setField('phone', '+79999999999');
buyerModel.setField('address', 'ул. Тестовая, д. 1');
console.log('Данные покупателя:', buyerModel.getData());
console.log('Валидация (все поля заполнены):', buyerModel.validate());

buyerModel.clear();
console.log('Данные покупателя после очистки:', buyerModel.getData());

appApi.getProducts()
  .then(items => {
    productsModel.setItems(items);
    console.log('Каталог с сервера:', productsModel.getItems());
  })
  .catch(error => {
    console.error('Ошибка при загрузке товаров:', error);
  });