import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { ServerApi } from "./components/communication/ServerApi";
import { IOrderResultApi, IProduct, TOrderResponse, TOrderFieldChange } from "./types";
import { Gallery } from "./components/views/Gallery";
import { CardCatalog } from "./components/views/Card/CardCatalog";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { CardPreview } from "./components/views/Card/CardPreview";
import { Modal } from "./components/views/Modal";
import { ShoppingCart } from "./components/models/ShoppingCart";
import { Header } from "./components/views/Header";
import { CardBasket } from "./components/views/Card/CardBasket";
import { Basket } from "./components/views/Basket";
import { Buyer } from "./components/models/Buyer";
import { OrderForm } from "./components/views/Form/OrderForm";
import { ContactsForm } from "./components/views/Form/ContactsForm";
import { Success } from "./components/views/Success";

const events = new EventEmitter();
const productsModel = new ProductCatalog(events);
const apiModel = new Api(API_URL);
const serverApiModel = new ServerApi(apiModel);
const shoppingCartModel = new ShoppingCart(events);
const buyerModel = new Buyer(events);

const gallery = new Gallery(ensureElement('.gallery'));
const modal = new Modal(ensureElement('#modal-container'), events);
const header = new Header(ensureElement('.header'), events);

const basket = new Basket(cloneTemplate('#basket'), events);
const success = new Success(cloneTemplate('#success'), {
    onClick: () => modal.close(),
});

const orderForm = new OrderForm(cloneTemplate('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate('#contacts'), events);

const cardPreview = new CardPreview(cloneTemplate('#card-preview'), events);

events.on("card-catalog:changed", () => {
    const items = productsModel.getProducts().map((item) => {
        const cardCatalog = new CardCatalog(cloneTemplate("#card-catalog"), {
            onClick: () => events.emit("card:selected", item),
        });
        return cardCatalog.render(item);
    });
    gallery.render({ catalog: items });
});

events.on("card:selected", (item: IProduct) => {
    productsModel.saveProduct(item);
});

events.on('product:selected', () => {
    const item = productsModel.getProduct();
    if (!item) {
        return;
    }
    modal.render({
        content: cardPreview.render({
            title: item.title,
            price: item.price,
            image: item.image,
            category: item.category,
            description: item.description,
            buttonText: item.price === null
                ? 'Недоступно'
                : shoppingCartModel.checkSelectedProduct(item.id)
                    ? 'Удалить из корзины'
                    : 'В корзину',
            disabled: item.price === null,
        }),
    });
    modal.open();
});

events.on('card:action', () => {
    const product = productsModel.getProduct();
    if (!product) {
        return;
    }
    if (shoppingCartModel.checkSelectedProduct(product.id)) {
        shoppingCartModel.deleteSelectedProduct(product.id);
    } else if (product.price !== null) {
        shoppingCartModel.addSelectedProduct(product);
    }
    modal.close();
});

events.on("shopping-cart:changed", () => {
    const basketItems = shoppingCartModel.getSelectedProducts().map((product, index) => {
        const cardBasket = new CardBasket(
            cloneTemplate("#card-basket"),
            () => shoppingCartModel.deleteSelectedProduct(product.id)
        );
        return cardBasket.render({
            title: product.title,
            price: product.price,
            index: index + 1
        });
    });

    basket.render({
        items: basketItems,
        price: shoppingCartModel.getTotal() || 0,
        purchaseOpportunity: shoppingCartModel.getSelectedProductsAmount() > 0,
    });

    header.render({ counter: shoppingCartModel.getSelectedProductsAmount() });
});

events.on('basket:open', () => {
    modal.render({ content: basket.render() });
    modal.open();
});

events.on('order:open', () => {
    modal.render({ content: orderForm.render() });
    modal.open();
});

events.on('order:submit', () => {
    modal.render({ content: contactsForm.render() });
    modal.open();
});

events.on('contacts:submit', () => {
    const orderData = {
        ...buyerModel.getData(),
        items: shoppingCartModel.getSelectedProducts().map((item) => item.id),
        total: shoppingCartModel.getTotal(),
    };

    serverApiModel.postOrder(orderData)
        .then((response: TOrderResponse) => {
            modal.render({ content: success.render({ total: response.total }) });
            modal.open();

            buyerModel.clearBuyerData();
            shoppingCartModel.clearShoppingCart();
        })
        .catch((error) => {
            console.error('Ошибка при оформлении заказа:', error);
        });
});

events.on('order:changed', (payload: TOrderFieldChange) => {
    if (payload.field === 'address') {
        buyerModel.saveAddress(payload.value);
    } else if (payload.field === 'payment') {
        buyerModel.savePaymentType(payload.value);
    }
});

events.on('contacts:changed', (payload: TOrderFieldChange) => {
    if (payload.field === 'email') {
        buyerModel.saveEmail(payload.value);
    } else {
        buyerModel.savePhone(payload.value);
    }
});

events.on('buyer-data:changed', () => {
    const buyerData = buyerModel.getData();
    const errors = buyerModel.validate();

    orderForm.render({
        address: buyerData.address,
        payment: buyerData.payment,
        valid: !errors.address && !errors.payment,
        errors: [errors.address, errors.payment].filter((e): e is string => Boolean(e)),
    });

    contactsForm.render({
        email: buyerData.email,
        phone: buyerData.phone,
        valid: !errors.email && !errors.phone,
        errors: [errors.email, errors.phone].filter((e): e is string => Boolean(e)),
    });
});

// Модели приводим в исходное состояние ПОСЛЕ регистрации всех подписок,
// чтобы shopping-cart:changed и buyer-data:changed вызвали начальный рендер.
shoppingCartModel.clearShoppingCart();
buyerModel.clearBuyerData();

serverApiModel
    .getProducts()
    .then((result: IOrderResultApi) => {
        productsModel.saveProducts(result.items);
    })
    .catch((error) => {
        console.error("Ошибка", error);
    });