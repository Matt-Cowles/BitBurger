let cart = null;

module.exports = class Cart {
  // Save an item to the cart
  static add(item) {
    if (cart === null) {
      cart = { items: [], totalPrice: 0, totalQty: 0 };
    }

    const itemIndex = cart.items.findIndex((i) => i.id === item.id);
    if (itemIndex >= 0) {
      const existingItem = cart.items[itemIndex];
      existingItem.qty += 1;
    } else {
      item.qty = 1;
      cart.items.push(item);
    }
    cart.totalQty += 1;
    cart.totalPrice += item.price;
  }

  //   Remove item from cart
  static remove(item) {
    const itemIndex = cart.items.findIndex((i) => i.id === item.id);
    const existingItem = cart.items[itemIndex];

    if (itemIndex < 0) {
      return null;
    }

    if (existingItem.qty > 1) {
      existingItem.qty -= 1;
      cart.totalQty -= 1;
      cart.totalPrice -= item.price;
    } else {
      existingItem.qty -= 1;
      cart.totalQty -= 1;
      cart.totalPrice -= item.price;
      cart.items.splice(itemIndex, 1);
    }

    if (cart.totalPrice < 0) {
      cart.totalPrice = 0;
    }
  }

  //   Get a list of the cart
  static getCart() {
    return cart;
  }
};
