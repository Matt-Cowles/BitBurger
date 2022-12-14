const mongoose = require("mongoose");
const { Schema } = mongoose;
const url = "https://imgs.search.brave.com/y1zBCNoZQA7d5ftqOjEItl0aJ179z5_HD8TBbpG-GLw/rs:fit:700:420:1/g:ce/aHR0cHM6Ly9pbWcu/Z3JvdXBvbmNkbi5j/b20vZGVhbC9nZEVD/OEhDVUQxalcyQWNa/amdReVo1LzE3OTc4/OTg0OS0yMDQ4eDEy/MjkvdjEvYzcwMHg0/MjAuanBn";

const menuSchema = new Schema({
  category: {
    type: String,
    enum: ["burger", "pizza", "fries", "drink", "dessert"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  desc: String,
  price: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Menu", menuSchema);
