const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const Menu = require("./models/menu");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/bit-burger");
}
main().then(() => console.log("Connected to db"));
main().catch((err) => console.log("AN ERROR!", err));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("bitburger/home");
});

app.get("/bitburger", async (req, res) => {
  const categories = ["Burger", "Pizza", "Fries", "Drinks", "Dessert"];
  const burgerList = [];
  const pizzaList = [];
  const friesList = [];
  const drinksList = [];
  const dessertList = [];

  const menuItems = await Menu.find({});

  const filteredItems = menuItems.filter(function (item) {
    if (item.category === "Burger") {
      burgerList.push(item);
    }
    if (item.category === "Pizza") {
      pizzaList.push(item);
    }
    if (item.category === "Fries") {
      friesList.push(item);
    }
    if (item.category === "Drinks") {
      drinksList.push(item);
    }
    if (item.category === "Dessert") {
      dessertList.push(item);
    }
  });

  //   const mappedItems = menuItems.map(function (item) {
  //     console.log(item);
  //   });

  console.log("The burger list is:", burgerList);
  res.render("bitburger/menu", { menuItems, burgerList, pizzaList, friesList, drinksList, dessertList });
});

app.listen(3000, () => console.log("listening on port 3000"));
