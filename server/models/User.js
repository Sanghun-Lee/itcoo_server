/**
 * Schema
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Card = new Schema({
  number: String,
  name: String,
  expire: String,
  cardImage: String,
  accountNum: String,
  bankName: String
});

const UserSchema = new Schema({
  id: String,
  password: String,
  name: String,
  birthDate: String,
  nickname: String,
  phone: String,
  image: String,
  lastDate: String,
  lastTime: String,
  card: Array,
  coupon: Array
});

module.exports = mongoose.model("User", UserSchema);
