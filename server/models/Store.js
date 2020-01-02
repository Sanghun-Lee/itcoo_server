/**
 * Schema
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
  name: String,
  latitude: Number,
  longitude: Number,
  branch: String,
  description: String,
  address: String,
  backgroundImage: String,
  thumbnail: String,
  phone: String,
  coupon: String,
  category: String,
  couponName: String,
  price: Number,
  ratio: Number
});

module.exports = mongoose.model("Store", StoreSchema);
