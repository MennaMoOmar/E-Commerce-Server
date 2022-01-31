/* imports npm */
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

/* import models */
const Order = require("../model/order");

/* import middleware */
const checkRequiredParams = require("../middleware/checkRequired");
const validateRequest = require("../middleware/validateRequest");

/* Routes */
//get all orders
router.get("/", async (req, res, next) => {
  try {
    const orders = await Order.find({});
    res.send(orders);
  } catch (err) {
    err.statusCode = 442;
    next(err);
  }
});

//add order
router.post(
  "/addOrder",
  checkRequiredParams(["products"]),
  async (req, res, next) => {
    const createdOrder = new Order(
      { products: req.body.products }
    );
    const order = await createdOrder.save();
    res.status(200).send(order);
  }
);

//delete order
router.delete("/:id", async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      await order.remove();
      res.status(200).send({ message: "order removed succesfuly" });
    } catch (err) {
      res.status(422).send({
        error: err,
        statusCode: 422,
      });
    }
  });

module.exports = router;
