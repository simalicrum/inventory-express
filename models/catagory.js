var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CatagorySchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
  description: { type: String },
});

CatagorySchema.virtual("url").get(function () {
  return "/catagories/" + this._id;
});

module.exports = mongoose.model("Catagory", CatagorySchema);
