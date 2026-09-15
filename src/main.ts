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
const basketTemplate = cloneTemplate('#basket');
const currentOrderForm = new OrderForm(cloneTemplate('#order'), events);
const currentContactsForm = new ContactsForm(cloneTemplate('#contacts'), events);

const cardPreviewTemplate = cloneTemplate('#card-preview');
const cardPreview = new CardPreview(cardPreviewTemplate, {
    onButtonClick: (product: IProduct) => {
        console.log('Product received in main.ts:', product.id);
        const isInCart = shoppingCartModel.checkSelectedProduct(product.id);

        if (isInCart) {
            shoppingCartModel.deleteSelectedProduct(product.id);
            console.log('Товар удалён из корзины:', product.id);
        } else if (product.price !== null) {
            shoppingCartModel.addSelectedProduct(product);
            console.log('Товар добавлен в корзину:', product.id);
        }

        updateCardPreviewButtonState(product);
        modal.close();
    }
});

let basket: Basket | null = null;
let success: Success | null = null;

function updateCardPreviewButtonState(product: IProduct): void {
    const isInCart = shoppingCartModel.checkSelectedProduct(product.id);
    if (product.price === null) {
        cardPreview.cardButtonText = 'Недоступно';
        cardPreview.disabled = true;
    } else if (isInCart) {
        cardPreview.cardButtonText = 'Удалить из корзины';
        cardPreview.disabled = false;
    } else {
        cardPreview.cardButtonText = 'В корзину';
        cardPreview.disabled = false;
    }
}

serverApiModel
    .getProducts()
    .then((result: IOrderResultApi) => {
        console.log("Товары получены с сервера");
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
    cardPreview.render({
        title: item.title,
        price: item.price,
        image: item.image,
        category: item.category,
        description: item.description,
        product: item
    });

    updateCardPreviewButtonState(item);

    modal.content = cardPreview.getContainer();
    modal.open();
});

events.on("shopping-cart:changed", () => {
    console.log('Событие shopping-cart:changed запущено');
    console.log('Текущие товары в корзине:', shoppingCartModel.getSelectedProducts());

    if (!basket) {
        basket = new Basket(basketTemplate, events);
    }

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
    modal.content = currentOrderForm.render();
    modal.open();
});

events.on('order:submit', () => {
    modal.content = currentContactsForm.render();
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
            if (!success) {
                success = new Success(cloneTemplate('#success'), {
                    onClick: () => {
                        modal.close();
                    },
                });
            }
            success.total = response.total;
            modal.content = success.render();
            modal.open();

            buyerModel.clearBuyerData();
            shoppingCartModel.clearShoppingCart();
        })
        .catch((error) => {
            console.error('Ошибка при оформлении заказа:', error);
        });
});

events.on('buyer-data:changed', () => {
    const buyerData = buyerModel.getData();
    currentOrderForm.render({
        address: buyerData.address,
        email: buyerData.email,
        phone: buyerData.phone,
        payment: buyerData.payment
    });
    currentContactsForm.render({
        address: buyerData.address,
        email: buyerData.email,
        phone: buyerData.phone,
        payment: buyerData.payment
    });
});

events.on('basket:open', () => {
    if (!basket) {
        basket = new Basket(basketTemplate, events);
    }
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

    modal.content = basket.getContainer();
    modal.open();
});

header.addBasketButtonClick(() => {
    events.emit('basket:open');
});
