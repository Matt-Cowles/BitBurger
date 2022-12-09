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

// function Cart(oldCart) {
//   this.items = oldCart.items || {};
//   this.qty = oldCart.qty || 0;
//   this.totalPrice = oldCart.totalPrice || 0;

//   this.add = function (item, id) {
//     let storedItem = this.items[id];
//     if (!storedItem) {
//       storedItem = this.items[id] = {
//         item: item,
//         qty: 0,
//         price: 0,
//       };
//     }
//     storedItem.qty++;
//     storedItem.price = storedItem.item.price * storedItem.qty;
//     this.qty++;
//     this.totalPrice += storedItem.price;
//   };

//   this.generateArray = function () {
//     const arr = [];
//     for (let id in this.items) {
//       arr.push(this.items[id]);
//     }
//     return arr;
//   };
// };
