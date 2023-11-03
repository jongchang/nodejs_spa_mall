const express = require('express');
const router = express.Router();

const Cart = require("../schemas/cart");
const Goods = require("../schemas/goods");
const authMiddleware = require("../middlewares/auth-middleware");

// const goods = [
//   {
//     goodsId: 4,
//     name: "상품 4",
//     thumbnailUrl:
//       "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
//     category: "drink",
//     price: 0.1,
//   },
//   {
//     goodsId: 3,
//     name: "상품 3",
//     thumbnailUrl:
//       "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
//     category: "drink",
//     price: 2.2,
//   },
//   {
//     goodsId: 2,
//     name: "상품 2",
//     thumbnailUrl:
//       "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
//     category: "drink",
//     price: 0.11,
//   },
//   {
//     goodsId: 1,
//     name: "상품 1",
//     thumbnailUrl:
//       "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
//     category: "drink",
//     price: 6.2,
//   },
// ];


// 상품 목록 조회 API
router.get("/goods", async (req, res) => {
  // res.json({ goods: goods });
  const { category } = req.query;

  const goods = await Goods.find(category ? { category } : {})
    .sort("-date")
    .exec();

  const results = goods.map((item) => {
    return {
      goodsId: item.goodsId,
      name: item.name,
      price: item.price,
      thumbnailUrl: item.thumbnailUrl,
      category: item.category,
    };
  });

  res.json({ goods: results });
});

// 상품 상세 조회 API
router.get("/goods/:goodsId", async (req, res) => {
  const { goodsId } = req.params;  
  // const [detail] = goods.filter((goods) => goods.goodsId === Number(goodsId));
  // res.json({ detail });

  const goods = await Goods.findOne({ goodsId: goodsId }).exec();

  if (!goods) return res.status(404).json({});

  const result = {
    goodsId: goods.goodsId,
    name: goods.name,
    price: goods.price,
    thumbnailUrl: goods.thumbnailUrl,
    category: goods.category,
  }

  res.json({ goods: result });
});

// 상품 생성 API
router.post("/goods", async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });
  if (goods.length) {
    return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다." });
  }

  const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

  res.json({ goods: createdGoods });
});



// localhost:3000/api/ GET
router.get("/", (req, res) => {
  res.send("default url for goods.js GET Method");
});

// localhost:3000/api/about GET
router.get("/about", (req, res) => {
  res.send("goods.js about PATH");
});



// 장바구니 목록 조회 API
router.get("/goods/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;

  const carts = await Cart.find({ userId }).exec();
  const goodsIds = carts.map((cart) => cart.goodsId);

  const goods = await Goods.find({ goodsId: goodsIds });
  // Goods에 해당하는 모든 정보를 가지고 올건데,
  // 만약 goodsIds 변수 안에 존재하는 값일 때에만 조회하라.

  const results = carts.map((cart) => {
    return {
      quantity: cart.quantity,
      goods: goods.find((item) => item.goodsId === cart.goodsId),
    };
  });

  res.json({
      carts: results,
  });
});

// 장바구니 상품 추가(등록) API
router.post("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ userId, goodsId }).exec();
  if (existsCarts.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "이미 장바구니에 존재하는 상품입니다.",
    });
  }

  await Cart.create({ userId, goodsId, quantity });

  res.json({ result: "success" });
});

// 장바구니 상품 수정 API
router.put("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { goodsId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    res.status(400).json({ errorMessage: "수량은 1 이상이어야 합니다." });
    return;
  }

  const existsCarts = await Cart.find({ userId, goodsId });
  if (existsCarts.length) {
    await Cart.updateOne(
      { userId, goodsId: goodsId },
      { $set: { quantity: quantity } }
    );
  }

  res.status(200).json({ success: true });
});

// 장바구니 상품 삭제 API
router.delete("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { goodsId } = req.params;

  const existsCarts = await Cart.find({ userId, goodsId });
  if (existsCarts.length) {
    await Cart.deleteOne({ userId, goodsId });
  }

  res.json({ result: "success" });
});


/** Router를 (app.js에서 사용하기 위해) export **/
module.exports = router;