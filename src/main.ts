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
console.log('Каталог:', productsModel.getItems());

basketModel.addItem(productsModel.getItems()[0]);
console.log('Корзина после добавления:', basketModel.getItems());
console.log('Общая стоимость:', basketModel.getTotalPrice());

buyerModel.setField('email', 'test@test.com');
console.log('Ошибки валидации:', buyerModel.validate());

appApi.getProducts()
  .then(items => {
    productsModel.setItems(items);
    console.log('Каталог с сервера:', productsModel.getItems());
  })
  .catch(error => {
    console.error('Ошибка при загрузке товаров:', error);
  });