import './scss/styles.scss';
import { Products } from './components/models/Products';
import { Basket } from './components/models/ShoppingCart';
import { Buyer } from './components/models/Buyer';
import { AppApi } from './components/models/AppApi';
import { Api } from './components/base/api';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();
const appApi = new AppApi(new Api(API_URL));

async function loadProductsFromServer() {
    try {
        const response = await appApi.getProducts();
        productsModel.setItems(response.items);
        console.log('Каталог с сервера:', productsModel.getItems());
        console.log(`Загружено ${response.items.length} товаров из ${response.total}`);
        return true;
    } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
        console.log('Используются локальные данные для тестирования');
        productsModel.setItems(apiProducts.items);
        return false;
    }
}

async function main() {
    await loadProductsFromServer();
    
    console.log('Каталог все товары:', productsModel.getItems());
    if (productsModel.getItems().length > 0) {
        console.log('Товар по id:', productsModel.getProductById(productsModel.getItems()[0].id));
    }

    const selectedProduct = productsModel.getItems()[0];
    if (selectedProduct) {
        productsModel.setSelectedProduct(selectedProduct);
        console.log('Выбранный товар:', productsModel.getSelectedProduct());
    }

    if (productsModel.getItems().length >= 2) {
        basketModel.addItem(productsModel.getItems()[0]);
        basketModel.addItem(productsModel.getItems()[1]);
        console.log('Корзина (все товары):', basketModel.getItems());
        console.log('Количество товаров в корзине:', basketModel.getTotalQuantity());
        console.log('Общая стоимость корзины:', basketModel.getTotalPrice());
        console.log('Есть ли товар в корзине:', basketModel.hasProduct(productsModel.getItems()[0].id));
        basketModel.removeItem(productsModel.getItems()[0].id);
        console.log('Корзина после удаления товара:', basketModel.getItems());
    }

    buyerModel.setField('payment', 'card');
    buyerModel.setField('email', 'test@test.com');
    buyerModel.setField('phone', '+79999999999');
    buyerModel.setField('address', 'ул. Тестовая, д. 1');
    console.log('Данные покупателя (все поля заполнены):', buyerModel.getData());
    console.log('Валидация (все поля заполнены):', buyerModel.validate());

    buyerModel.clear();
    buyerModel.setField('payment', 'card');
    buyerModel.setField('email', '');
    buyerModel.setField('phone', '+79999999999');
    buyerModel.setField('address', '');
    
    console.log('Данные покупателя (не все поля заполнены):', buyerModel.getData());
    const validationErrors = buyerModel.validate();
    console.log('Валидация (с пустыми полями):', validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
        Object.entries(validationErrors).forEach(([field, error]) => {
            console.log(`  - ${field}: ${error}`);
        });
    }

    buyerModel.clear();
    buyerModel.setField('payment', '');
    buyerModel.setField('email', 'test@test.com');
    buyerModel.setField('phone', '');
    buyerModel.setField('address', 'ул. Тестовая, д. 1');
    
    console.log('Данные покупателя (частично заполнены):', buyerModel.getData());
    const partialValidationErrors = buyerModel.validate();
    console.log('Валидация (частично заполнены):', partialValidationErrors);
    
    if (Object.keys(partialValidationErrors).length > 0) {
        Object.entries(partialValidationErrors).forEach(([field, error]) => {
            console.log(`  - ${field}: ${error}`);
        });
    }

    buyerModel.clear();
    console.log('Данные покупателя (полностью пустые):', buyerModel.getData());
    const emptyValidationErrors = buyerModel.validate();
    console.log('Валидация (полностью пустые):', emptyValidationErrors);
    
    if (Object.keys(emptyValidationErrors).length > 0) {
        Object.entries(emptyValidationErrors).forEach(([field, error]) => {
            console.log(`  - ${field}: ${error}`);
        });
    }

    buyerModel.clear();
    console.log('Данные покупателя после очистки:', buyerModel.getData());

    if (basketModel.getItems().length > 0) {
        buyerModel.setField('payment', 'card');
        buyerModel.setField('email', 'test@test.com');
        buyerModel.setField('phone', '+79999999999');
        buyerModel.setField('address', 'ул. Тестовая, д. 1');
        
        if (buyerModel.isComplete()) {
            const orderData = {
                payment: buyerModel.getData().payment as string,
                email: buyerModel.getData().email as string,
                phone: buyerModel.getData().phone as string,
                address: buyerModel.getData().address as string,
                items: basketModel.getItems().map(item => item.id),
                total: basketModel.getTotalPrice()
            };
            
            try {
                const result = await appApi.postOrder(orderData);
                console.log('Заказ успешно оформлен:', result);
                console.log('ID заказа:', result.id);
                console.log('Итоговая сумма:', result.total);
            } catch (error) {
                console.error('Ошибка оформления заказа:', error);
            }
        }
    }
};

/* спасибо за проверку и такие комментарии, это был очень ценный опыт */