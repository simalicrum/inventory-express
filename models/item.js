var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: { type: String },
  description: { type: String },
  price: { type: Number },
  number: { type: Number },
  catagories: [{ type: Schema.Types.ObjectId, ref: "Catagory" }],
});

ItemSchema.virtual("totalvalue").get(function () {
  return this.price * this.number;
});

ItemSchema.virtual("url").get(function () {
  return "/item/" + this._id;
});

//Export model
module.exports = mongoose.model("Item", ItemSchema);
