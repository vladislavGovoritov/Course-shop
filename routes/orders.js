const { Router } = require("express");
const router = Router();
const Order = require("../models/order");
const user = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id }).populate(
      "user.userId"
    );
    res.render("orders.hbs", {
      title: "Заказы",
      isOrder: true,
      orders: orders.map((o) => {
        return {
          ...o._doc,
          price: o.courses.reduce((total, c) => {
            return (total += c.count * c.course.price);
          }, 0),
        };
      }),
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await req.user.populate("cart.items.courseId").execPopulate();

    const courses = user.cart.items.map((i) => ({
      count: i.count,
      course: { ...i.courseId._doc },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },

      courses: courses,
    });
    await order.save();
    await req.user.clearCart();

    res.redirect("/orders");
  } catch (e) {
    console.log(error);
  }
});

module.exports = router;
