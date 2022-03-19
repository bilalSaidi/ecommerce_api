const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./router/user");
const authenticationRoute = require("./router/auth");
const productRoute = require("./router/product");
const cartRoute = require("./router/cart");
const orderRoute = require("./router/order");

app.use(express.json());
dotenv.config();
const version_api = "/api/v1";
// Connect To Data Base
mongoose
  .connect(process.env.DataBase_Url)
  .then(() => {
    console.log("DB Connection Successful .. ");
  })
  .catch((err) => {
    console.log(err);
  });

// Router

// userRouter

app.use(version_api + "/user", userRouter);

// Authentication Route
app.use(version_api + "/auth", authenticationRoute);

// Product Route
app.use(version_api + "/product", productRoute);

// Cart Route
app.use(version_api + "/cart", cartRoute);

// Order Route
app.use(version_api + "/order", orderRoute);

// Listen To Port
app.listen(process.env.PORT || 5000, () => {
  console.log("api running ...");
});
