export let cart = JSON.parse(localStorage.getItem("cart")) || [
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
    deliveryOptionId: "1",
  },
  {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
    deliveryOptionId: "2",
  },
];

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log(cart);
}

export function addToCart(productId) {
  const matchingItem = cart.find(
    (cartItem) => cartItem.productId === productId
  );

  const quantity = +document.querySelector(`.js-quantity-selector-${productId}`)
    .value;

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
      deliveryOptionId: "1",
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();
}

export function calculateCartQuantity() {
  return cart.reduce((total, value) => (total += value.quantity), 0);
}

export function updateQuantity(productId, newQuantity) {
  const matchingItem = cart.find((cartItem) => {
    return cartItem.productId === productId;
  });

  console.log(matchingItem);

  if (matchingItem) {
    matchingItem.quantity = newQuantity;
    saveToStorage();
  }
}
