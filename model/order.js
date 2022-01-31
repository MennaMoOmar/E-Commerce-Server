/* imports */
const mongoose = require("mongoose");

/* schema */
const schema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
      name: {
        type: String,
        require: true,
      },
      pricePerPiece: {
        type: Number,
        require: true,
      },
      price: {
        type: Number,
        require: true,
      },
      count: {
        type: Number,
        require: true,
      },
    },
  ],
});

//return specific data
schema.methods.toJSON = function () {
  const order = this;
  const orderObject = order.toObject();
  delete orderObject.__v;
  return orderObject;
};

const Order = mongoose.model("Order", schema);

module.exports = Order;
