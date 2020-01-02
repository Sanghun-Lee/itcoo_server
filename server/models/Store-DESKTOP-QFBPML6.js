/**
 * Schema
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
  StoreName: String,
  latitude: Number,
  longitude: Number,
  branch: String,
  Description: String,
  Address: String,
  BackgroundImage: String,
  ThumbNail: String,
  Phone: String,
});

module.exports = mongoose.model('Store', StoreSchema);
