const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const catchAsync = require("./utils/catchAsync");

const Menu = require("./models/menu");
const User = require("./models/user");
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
app.use(flash());

const sessionOptions = {
  secret: "thisisabadsecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: "mongodb://localhost:27017/bit-burger",
    // autoRemove: "interval",
    // autoRemoveInterval: 1, // In minutes. Default
  }),
  cookie: { path: "/", httpOnly: true, maxAge: 1800000 }, // Cookie expires after 30min
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.authenticate("session"));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
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

  if (req.session.cart) {
    req.session.cart = Cart.getCart();
  } else {
    Cart.clearCart();
    req.session.cart = null;
  }
  const cart = req.session.cart;
  console.log(cart);

  res.render("bitburger/menu", { menuItems, burgerList, pizzaList, friesList, drinksList, dessertList, cart });
});

app.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      console.log(registeredUser);
      req.flash("success", `Thanks for signing up ${username}`);
      res.redirect("/bitburger");
    } catch (e) {
      console.log(e);
      req.flash("error", e.message);
      res.redirect("/bitburger");
      console.log(e);
    }
  })
);

app.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/bitburger" }), (req, res) => {
  req.flash("success", `Welcome back ${req.body.username}!`);
  res.redirect("/bitburger");
});

app.put("/:id/add-cart", async (req, res) => {
  const item = await Menu.findById(req.params.id);

  Cart.add(item);
  req.session.cart = Cart.getCart();

  req.flash("success", "Item added to your cart!");
  res.redirect("/bitburger");
});

app.put("/:id/remove-cart", async (req, res) => {
  const item = await Menu.findById(req.params.id);

  Cart.remove(item);
  req.session.cart = Cart.getCart();

  req.flash("success", "Item removed from your cart!");
  res.redirect("/bitburger");
});

app.post("/confirm-order", (req, res) => {
  req.flash("success", "Order placed! Check your email. It may take a few minutes ");
  res.redirect("/bitburger");
});

app.listen(3000, () => console.log("listening on port 3000"));
