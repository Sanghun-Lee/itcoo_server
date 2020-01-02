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

module.exports = mongoose.model("Card", Card);
