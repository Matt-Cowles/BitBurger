let cart = null;

module.exports = class Cart {
  static save(item) {
    if (cart) {
      const existingItemIndex = cart.items.findIndex((i) => i.id === item.id);
      console.log("existingItemIndex: ", existingItemIndex);
      if (existingItemIndex > 0) {
        const existingItem = cart.items[existingItemIndex];
        existingItem.qty += 1;
        cart.totalPrice += item.price;
      } else {
        item.qty = 1;
        cart.items.push(item);
        cart.totalPrice += item.price;
      }
    } else {
      cart = { items: [], totalPrice: 0 };
      item.qty = 1;
      cart.items.push(item);
      cart.totalPrice = item.price;
    }
  }
  static getCart() {
    return cart;
  }
};
