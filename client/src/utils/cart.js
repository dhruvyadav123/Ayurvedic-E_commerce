const CART_KEY = "ayurvedic_cart";

/* GET CART */
export const getCart = () => {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
};

/* ADD TO CART */
export const addToCart = (product) => {
  const cart = getCart();
  const exist = cart.find((item) => item._id === product._id);

  if (exist) {
    exist.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

/* UPDATE QTY */
export const updateQty = (id, qty) => {
  const cart = getCart().map((item) =>
    item._id === id ? { ...item, qty } : item
  );

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

/* REMOVE ITEM */
export const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item._id !== id);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

/* CLEAR CART */
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cartUpdated"));
};

/* CART COUNT 🔥 */
export const cartCount = () => {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
};
