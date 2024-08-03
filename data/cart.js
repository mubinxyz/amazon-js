export const cart = [];

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
    });
  }
}
