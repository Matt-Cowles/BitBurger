const mongoose = require("mongoose");
const { Schema } = mongoose;
const url = "https://imgs.search.brave.com/y1zBCNoZQA7d5ftqOjEItl0aJ179z5_HD8TBbpG-GLw/rs:fit:700:420:1/g:ce/aHR0cHM6Ly9pbWcu/Z3JvdXBvbmNkbi5j/b20vZGVhbC9nZEVD/OEhDVUQxalcyQWNa/amdReVo1LzE3OTc4/OTg0OS0yMDQ4eDEy/MjkvdjEvYzcwMHg0/MjAuanBn";

const menuSchema = new Schema({
  category: {
    type: String,
    enum: ["Burger", "Pizza", "Fries", "Drinks", "Dessert"],
    required: true,
  },
  name: String,
  image: {
    type: String,
    default: url,
  },
  desc: String,
  price: Number,
});

module.exports = mongoose.model("Menu", menuSchema);
