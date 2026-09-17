import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { ProductCatalog } from "./components/models/ProductCatalog";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { ServerApi } from "./components/communication/ServerApi";
import { IOrderResultApi, IProduct, TOrderResponse } from "./types";
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

const cardPreview = new CardPreview(cloneTemplate('#card-preview'), {
    onButtonClick: (product: IProduct) => {
        const isInCart = shoppingCartModel.checkSelectedProduct(product.id);

        if (isInCart) {
            shoppingCartModel.deleteSelectedProduct(product.id);
        } else if (product.price !== null) {
            shoppingCartModel.addSelectedProduct(product);
        }

        modal.close();
    }
});

serverApiModel
    .getProducts()
    .then((result: IOrderResultApi) => {
        productsModel.saveProducts(result.items);
    })
    .catch((error) => {
        console.error("Ошибка", error);
    });

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

events.on("product:selected", (item: IProduct) => {
    modal.render({
        content: cardPreview.render({
            title: item.title,
            price: item.price,
            image: item.image,
            category: item.category,
            description: item.description,
            product: item,
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

events.on("shopping-cart:changed", () => {
    const basketItems = shoppingCartModel.getSelectedProducts().map((product, index) => {
        const cardBasket = new CardBasket(
            cloneTemplate("#card-basket"),
            (id: string) => shoppingCartModel.deleteSelectedProduct(id)
        );
        cardBasket.setId(product.id);
        return cardBasket.render({
            title: product.title,
            price: product.price,
            index: index + 1
        });
    });

    basket.render({
        items: basketItems,
        price: shoppingCartModel.getTotal() || 0
    });

    header.counter = shoppingCartModel.getSelectedProductsAmount();
    basket.setPurchaseOpportunity(shoppingCartModel.getSelectedProductsAmount() === 0);
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
            success.total = response.total;
            modal.render({ content: success.render() });
            modal.open();

            buyerModel.clearBuyerData();
            shoppingCartModel.clearShoppingCart();
        })
        .catch((error) => {
            console.error('Ошибка при оформлении заказа:', error);
        });
});

events.on('order:changed', (payload: { field: string; value: string }) => {
    if ('address' in payload) {
        buyerModel.saveAddress(payload.address);
    }
    if ('payment' in payload) {
        buyerModel.savePaymentType(payload.payment);
    }
});

events.on('contacts:changed', (payload: { field: string; value: string }) => {
    if ('email' in payload) {
        buyerModel.saveEmail(payload.email);
    }
    if ('phone' in payload) {
        buyerModel.savePhone(payload.phone);
    }
});

events.on('buyer-data:changed', () => {
    const buyerData = buyerModel.getData();
    const errors = buyerModel.validate();

    orderForm.render({
        address: buyerData.address,
        payment: buyerData.payment,
        valid: !errors.address && !errors.payment,
        errors: [errors.address, errors.payment].filter(Boolean).join(', '),
    });

    contactsForm.render({
        email: buyerData.email,
        phone: buyerData.phone,
        valid: !errors.email && !errors.phone,
        errors: [errors.email, errors.phone].filter(Boolean).join(', '),
    });
});

events.on('basket:open', () => {
    modal.render({ content: basket.render() });
    modal.open();
});

events.on('shopping-cart:open', () => {
    events.emit('basket:open');
});