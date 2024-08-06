function isNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

export default function validateNewQuantity(newQuantity) {
  if (isNumber(newQuantity) && newQuantity >= 0 && newQuantity < 1000) {
    return true;
  } else {
    return false;
  }
}
