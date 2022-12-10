const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const Menu = require("./models/menu");
const Cart = require("./models/cart");

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

const sessionOptions = {
  secret: "thisisabadsecret",
  resave: false,
  saveUninitialized: true,
  store: new MongoStore((mongooseConnection = mongoose.connection)),
};

app.use(session(sessionOptions));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.get("/", (req, res) => {
  res.render("bitburger/home");
});

app.get("/bitburger", async (req, res) => {
  const burgerList = [];
  const pizzaList = [];
  const friesList = [];
  const drinksList = [];
  const dessertList = [];

  const menuItems = await Menu.find({});

  const filteredItems = menuItems.filter(function (item) {
    if (item.category === "burger") {
      burgerList.push(item);
    }
    if (item.category === "pizza") {
      pizzaList.push(item);
    }
    if (item.category === "fries") {
      friesList.push(item);
    }
    if (item.category === "drink") {
      drinksList.push(item);
    }
    if (item.category === "dessert") {
      dessertList.push(item);
    }
  });

  //   const mappedItems = menuItems.map(function (item) {
  //     console.log(item);
  //   });

  req.session.cart = Cart.getCart();
  const cart = req.session.cart;
  console.log(cart);

  res.render("bitburger/menu", { menuItems, burgerList, pizzaList, friesList, drinksList, dessertList, cart });
});

app.put("/:id/add-cart", async (req, res) => {
  const item = await Menu.findById(req.params.id);

  Cart.add(item);
  req.session.cart = Cart.getCart();

  res.redirect("/bitburger");
});

app.put("/:id/remove-cart", async (req, res) => {
  const item = await Menu.findById(req.params.id);

  Cart.remove(item);
  req.session.cart = Cart.getCart();

  res.redirect("/bitburger");
});

app.listen(3000, () => console.log("listening on port 3000"));
