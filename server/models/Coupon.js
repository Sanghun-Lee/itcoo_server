const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Coupon = new Schema({
  type: String,
  name: String,
  publishDate: String,
  storeName: String,
  storeCategory: String,
  branch: String,
  image: String,
  stampNumber: Number,
  price: Number,
  ratio: Number,
  store_id: Object
});

module.exports = mongoose.model("Coupon", Coupon);
