const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const homeRoutes = require("./routes/home"),
  addRoutes = require("./routes/add"),
  coursesRoutes = require("./routes/courses");
  cardRoutes = require("./routes/card");
  ordersRoutes = require('./routes/orders')
const User = require('./models/user')

const app = express();

const hbs = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: "main",
  extname: "hbs",
});



app.engine("hbs", hbs.engine);
app.set("views engine", "hbs");
app.set("views", "views");

app.use(async (req, res, next)=> {
  try {
    const user = await User.findById('5f590fd0cef843181ccbc58d')
    req.user = user
    next()
  } catch(e) {
  console.log(e)
  }
   
})

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", homeRoutes);

app.use("/add", addRoutes);

app.use("/courses", coursesRoutes);

app.use("/card", cardRoutes);

app.use('/orders', ordersRoutes)

async function start() {
  try {
    const url = `mongodb+srv://Vladislav:rw0bEqxYZ1KMAZ96@cluster0.f9fzh.mongodb.net/shop`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});
    const PORT = process.env.PORT || 3000;

    const candidate = await User.findOne()
    if(!candidate) {
      const user = new User({
        email: 'govoritov2020@mail.ru',
        name: 'vladislav',
        cart:{items:[]}
      })
      await user.save()
    }
    

    app.listen(PORT, () => {
      console.log(`Server is running ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
