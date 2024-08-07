import {
  cart,
  removeFromCart,
  updateDeliveryOption,
  updateQuantity,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { calculateCartQuantity } from "../data/cart.js";
import { formatCurrency } from "./utils/money.js";
// import updateCartQuantity from "./utils/updateCartQuantity.js";
import validateNewQuantity from "./utils/validateNewQuantity.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../data/deliveryOptions.js";
// import { html } from "lit-html";

const today = dayjs();
const deliveryDate = today.add(7, "days");
console.log(deliveryDate.format("dddd, MMMM D"));

function renderOrderSummary() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    });

    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption;

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `
    <div
      class="cart-item-container js-cart-item-container-${matchingProduct.id}"
    >
      <div class="delivery-date">Delivery date: ${dateString}</div>

      <div class="cart-item-details-grid">
        <img class="product-image" src="${matchingProduct.image}" />

        <div class="cart-item-details">
          <div class="product-name">${matchingProduct.name}</div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity:
              <span
                class="quantity-label js-quantity-label-${matchingProduct.id}"
                >${cartItem.quantity}</span
              >
            </span>
            <span
              class="update-quantity-link js-update-quantity-link link-primary"
              data-product-id="${matchingProduct.id}"
            >
              Update
            </span>
            <input
              class="quantity-input js-quantity-input-${matchingProduct.id}"
              data-product-id="${matchingProduct.id}"
              value="${cartItem.quantity}"
            />
            <span
              class="save-quantity-link js-save-quantity-link link-primary"
              data-product-id="${matchingProduct.id}"
              >Save</span
            >
            <span
              class="delete-quantity-link link-primary js-delete-link"
              data-product-id="${matchingProduct.id}"
            >
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">Choose a delivery option:</div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
  `;
  });

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  function removeCartFromHTML(productId) {
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.remove();
    updateCheckoutHTML();
  }
  function updateCheckoutHTML() {
    document.querySelector(".js-return-to-home-link").textContent =
      calculateCartQuantity();
  }

  function handleUpdateAndSave(productId) {
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );

    container.classList.remove("is-editing-quantity");

    const newQuantity = +document.querySelector(
      `.js-quantity-input-${productId}`
    ).value;

    if (validateNewQuantity(newQuantity)) {
      if (newQuantity === 0) {
        removeFromCart(productId);
        removeCartFromHTML(productId);
      } else {
        updateQuantity(productId, newQuantity);

        const quantityLabel = document.querySelector(
          `.js-quantity-label-${productId}`
        );
        quantityLabel.textContent = newQuantity;

        updateCheckoutHTML();
      }
    } else {
      window.alert("please enter a value between 0 and 1000");
    }
  }

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;

      removeFromCart(productId);

      removeCartFromHTML(productId);
    });
  });

  document
    .querySelectorAll(".js-update-quantity-link")
    .forEach((updateButton) => {
      updateButton.addEventListener("click", () => {
        const { productId } = updateButton.dataset;

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.add("is-editing-quantity");
        // Find the input field and focus it
        const quantityInput = document.querySelector(
          `.js-quantity-input-${productId}`
        );
        if (quantityInput) {
          quantityInput.focus();
        }
      });
    });

  document.querySelectorAll(".js-save-quantity-link").forEach((saveButton) => {
    saveButton.addEventListener("click", () => {
      const { productId } = saveButton.dataset;
      handleUpdateAndSave(productId);
    });
  });

  document.querySelectorAll(".js-save-quantity-link").forEach((saveButton) => {
    document.body.addEventListener("keydown", (event) => {
      const { productId } = saveButton.dataset;

      if (event.key === "Enter") {
        handleUpdateAndSave(productId);
      }
    });
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");

      const priceString =
        deliveryOption.priceCents === 0
          ? "Free"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `<div class="delivery-option js-delivery-option" data-product-id="${
        matchingProduct.id
      }" data-delivery-option-id="${deliveryOption.id}">
      <input
        type="radio"
        ${isChecked ? "checked" : ""}
        class="delivery-option-input"
        name="delivery-option-1-${matchingProduct.id}"
      />
      <div>
        <div class="delivery-option-date">${dateString}</div>
        <div class="delivery-option-price">${priceString}</div>
      </div>
    </div>`;
    });

    return html;
  }

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;

      updateDeliveryOption(productId, deliveryOptionId);

      renderOrderSummary();
    });
  });

  updateCheckoutHTML();
}

renderOrderSummary();
