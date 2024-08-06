import { calculateCartQuantity } from "../../data/cart.js";

export default function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();
  document.querySelector(".js-cart-quantity").textContent = cartQuantity;
  console.log("cart quantity updated");
}
