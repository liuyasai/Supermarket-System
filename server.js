const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

var jsonParser = bodyParser.json();

const app = express();
app.use(express.static(__dirname + "/static"));
app.use(cors());

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/supermarket");
//测试数据库连接
mongoose.connection.once("open", function () {
  console.log("数据库链接成功");
});

var ProductSchema = mongoose.Schema({
  id: String,
  name: String,
  price: String,
  productImg: String,
  number: Number,
  buyNumber: Number,
  select: Boolean,
  category: String,
});
var OrderSchema = mongoose.Schema({
  userInfo: String,
  name: String,
  region: String,
  tel: String,
  date1: String,
  date2: String,
});

let Products = mongoose.model("Products", ProductSchema);
let userOrders = mongoose.model("userOrders", OrderSchema);

//定义请求所有商品接口
app.get("/allProducts", (request, response) => {
  //设置响应头 设置允许跨域
  // response.setHeader("Access-Control-Allow-Origin", "*");
  Products.find({}, function (err, docs) {
    if (err) {
      console.log("出错了");
    }
    let arr = docs;
    response.send(arr);
  });
});

//定义我的购物车接口
app.get("/myShopCar", (req, res) => {
  userShopCar = req.query.userInfo + "shopcars";
  // console.log(userShopCar);
  userShopCar = mongoose.model(userShopCar, ProductSchema);
  userShopCar.find({}, function (err, docs) {
    if (err) {
      console.log("出错了");
    }
    let arr = docs;
    res.send(arr);
  });
});

//定义加入购物车接口
app.post("/addShopCar", jsonParser, (req, res) => {
  //设置响应头 设置允许跨域
  // res.setHeader("Access-Control-Allow-Origin", "*");

  let userShopCar = req.body.userInfo + "ShopCar";
  // console.log(req.body.product);
  userShopCar = mongoose.model(userShopCar, ProductSchema);
  userShopCar.find({ name: req.body.product.name }, function (err, docs) {
    if (docs.length == 0) {
      // console.log(111);
      userShopCar.create(req.body.product, function (err, docs) {
        if (!err) res.send("加入购物车成功");
      });
    } else {
      num = docs[0].buyNumber + 1;
      userShopCar.update(
        { name: req.body.product.name },
        { buyNumber: num },
        function (err) {
          if (!err) res.send("购买数量更新成功");
        }
      );
    }
  });
});

//定义删除购物车商品接口
app.get("/deleteProduct", (req, res) => {
  // console.log(req.query);
  userShopCar = req.query.userInfo + "shopcars";
  // console.log(userShopCar);
  userShopCar = mongoose.model(userShopCar, ProductSchema);
  userShopCar.deleteMany({ _id: req.query.id }, function (err, docs) {
    if (!err) {
      userShopCar.find({}, function (err, docs) {
        if (err) {
          console.log("出错了");
        }
        let arr = docs;
        res.send(arr);
      });
    }
  });
});

//定义添加商品接口
app.post("/addProduct", jsonParser, (req, res) => {
  //设置响应头 设置允许跨域
  // res.setHeader("Access-Control-Allow-Origin", "*");
  // console.log(req.body.product);
  if (req.body.product.name) {
    Products.create(req.body.product, (err, docs) => {
      if (!err) {
        Products.find({}, (err, docs) => {
          res.send(docs);
        });
      }
    });
  }
});

//定义删除商品接口
app.get("/deleteOneProduct", (req, res) => {
  // console.log(req.query);
  Products.deleteMany({ _id: req.query.id }, function (err, docs) {
    if (!err) {
      Products.find({}, function (err, docs) {
        if (err) {
          console.log("出错了");
        }
        res.send(docs);
      });
    }
  });
});

//定义搜索商品接口
app.get("/SearchProduct", (req, res) => {
  // console.log(req.query);
  const re = new RegExp(req.query.name);
  console.log(req.query.name);
  Products.find({ name: re }, function (err, docs) {
    if (err) {
      console.log("出错了");
    }
    res.send(docs);
  });
});

//定义更新购物车商品信息接口
app.get("/UpdateShopCar", (req, res) => {
  // console.log(req.query);
  userShopCar = req.query.userInfo + "shopcars";
  userShopCar = mongoose.model(userShopCar, ProductSchema);
  if (req.query.buyNumber) {
    userShopCar.update(
      { _id: req.query.id },
      { buyNumber: req.query.buyNumber },
      (err, docs) => {
        if (err) {
          console.log("出错了");
        }
      }
    );
  }
  if (req.query.select) {
    // console.log(req.query);
    userShopCar.update(
      { _id: req.query.id },
      { select: req.query.select },
      (err, docs) => {
        if (err) {
          console.log("出错了");
        }
        // console.log(docs);
      }
    );
  }
});

//定义分类接口
app.get("/categoryProduct1", (req, res) => {
  Products.find({ category: "食品饮料" }, function (err, docs) {
    if (err) {
      console.log("出错了");
    }
    console.log(docs);
    res.send(docs);
  });
});

app.get("/categoryProduct2", (req, res) => {
  console.log(req.query.category);
  Products.find({ category: "生活用品" }, function (err, docs) {
    if (err) {
      console.log("出错了");
    }
    console.log(docs);
    res.send(docs);
  });
});

app.get("/categoryProduct3", (req, res) => {
  console.log(req.query.category);
  Products.find({ category: "美容洗护" }, function (err, docs) {
    if (err) {
      console.log("出错了");
    }
    console.log(docs);
    res.send(docs);
  });
});

app.get("/categoryProduct4", (req, res) => {
  console.log(req.query.category);
  Products.find({ category: "家居家电" }, function (err, docs) {
    if (err) {
      console.log("出错了");
    }
    console.log(docs);
    res.send(docs);
  });
});

//定义下订单接口
app.post("/addOrder", jsonParser, (req, res) => {
  // console.log(req.body.order);
  userOrders.create(req.body.order, (err, docs) => {});
});

//定义获取订单信息接口
app.get("/allorders", (request, response) => {
  //设置响应头 设置允许跨域
  // response.setHeader("Access-Control-Allow-Origin", "*");
  userOrders.find({}, function (err, docs) {
    if (err) {
      console.log("出错了");
    }
    let arr = docs;
    // console.log(arr);
    response.send(arr);
  });
});

//定义订单商品接口
app.get("/orderProduct", (req, res) => {
  userShopCar = req.query.userInfo + "shopcars";
  userShopCar = mongoose.model(userShopCar, ProductSchema);
  userShopCar.find({ select: true }, function (err, docs) {
    if (err) {
      console.log("出错了");
    }
    // console.log(docs);
    res.send(docs);
  });
});

//定义用户订单接口
app.listen(5005, (err) => {
  if (!err) console.log("服务器启动成功了");
});
