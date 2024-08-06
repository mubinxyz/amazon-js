import { cart, removeFromCart, updateQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { calculateCartQuantity } from "../data/cart.js";
import { formatCurrancy } from "./utils/money.js";
import updateCartQuantity from "./utils/updateCartQuantity.js";
import validateNewQuantity from "./utils/validateNewQuantity.js";

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${
      matchingProduct.id
    }">
      <div class="delivery-date">Delivery date: Tuesday, June 21</div>

      <div class="cart-item-details-grid">
        <img
          class="product-image"
          src="${matchingProduct.image}"
        />

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">$${formatCurrancy(
            matchingProduct.priceCents
          )}</div>
          <div class="product-quantity">
            <span> Quantity: <span class="quantity-label js-quantity-label-${
              matchingProduct.id
            }">${cartItem.quantity}</span> </span>
            <span class="update-quantity-link js-update-quantity-link link-primary" data-product-id="${
              matchingProduct.id
            }">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${
              matchingProduct.id
            }" data-product-id="${matchingProduct.id}" value="${
    cartItem.quantity
  }">                 
            <span class="save-quantity-link js-save-quantity-link link-primary" data-product-id="${
              matchingProduct.id
            }">Save</span>     
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
              matchingProduct.id
            }">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input
              type="radio"
              checked
              class="delivery-option-input"
              name="delivery-option-1-${matchingProduct.id}"
            />
            <div>
              <div class="delivery-option-date">Tuesday, June 21</div>
              <div class="delivery-option-price">FREE Shipping</div>
            </div>
          </div>
          <div class="delivery-option">
            <input
              type="radio"
              class="delivery-option-input"
              name="delivery-option-1-${matchingProduct.id}"
            />
            <div>
              <div class="delivery-option-date">Wednesday, June 15</div>
              <div class="delivery-option-price">$4.99 - Shipping</div>
            </div>
          </div>
          <div class="delivery-option">
            <input
              type="radio"
              class="delivery-option-input"
              name="delivery-option-1-${matchingProduct.id}"
            />
            <div>
              <div class="delivery-option-date">Monday, June 13</div>
              <div class="delivery-option-price">$9.99 - Shipping</div>
            </div>
          </div>
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

  const newQuantity = +document.querySelector(`.js-quantity-input-${productId}`)
    .value;

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

// document.body.addEventListener("keydown", (event) => {
//   document.querySelectorAll(".js-save-quantity-link").forEach((saveButton) => {
//     saveButton.addEventListener("click", () => {
//       const { productId } = saveButton.dataset;

//       if (event.key === "Enter") {
//         handleUpdateAndSave(productId);
//       }
//     });
//   });
// });

updateCheckoutHTML();
