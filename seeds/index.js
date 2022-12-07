const mongoose = require("mongoose");
const Menu = require("../models/menu");
const menu = require("./menuHelper");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/bit-burger");
}
main().then((data) => console.log("Connected"));
main().catch((err) => console.log("AN ERROR!", err));

const seedDB = async () => {
  await Menu.deleteMany({});
  for (let i = 0; i < menu.length; i++) {
    const menuItem = new Menu({
      category: `${menu[i].category}`,
      name: `${menu[i].name}`,
      image: `${menu[i].image}`,
      desc: `${menu[i].desc}`,
      price: `${menu[i].price}`,
    });
    console.log(menuItem);
    await menuItem.save();
  }
};

seedDB().then(() => mongoose.connection.close());
