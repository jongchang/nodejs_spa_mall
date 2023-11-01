const express = require('express');
const router = express.Router();

const Goods = require("../schemas/goods");
const Cart = require("../schemas/cart");

// // 상품 목록 조회 API
// router.get("/goods", (req, res) => {
//   res.json({ goods: goods });
// });

// // 상품 상세 조회 API
// router.get("/goods/:goodsId", (req, res) => {
//   const { goodsId } = req.params;
//   const [detail] = goods.filter((goods) => goods.goodsId === Number(goodsId));
//   res.json({ detail });
// });


// localhost:3000/api/ GET
router.get("/", (req, res) => {
  res.send("default url for goods.js GET Method");
});

// localhost:3000/api/about GET
router.get("/about", (req, res) => {
  res.send("goods.js about PATH");
});

router.post("/goods", async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });
  if (goods.length) {
    return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다." });
  }

  const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

  res.json({ goods: createdGoods });
});


// 장바구니 목록 조회 API
router.get("/goods/cart", async (req, res) => {
  const carts = await Cart.find();
  const goodsIds = carts.map((cart) => cart.goodsId);

  const goods = await Goods.find({ goodsId: goodsIds });

  res.json({
      carts: carts.map((cart) => ({
        quantity: cart.quantity,
        goods: goods.find((item) => item.goodsId === cart.goodsId),
      })),
  });
});

// 장바구니 상품 추가 API
router.post("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (existsCarts.length) {
    return res.json({ success: false, errorMessage: "이미 장바구니에 존재하는 상품입니다." });
  }

  await Cart.create({ goodsId: Number(goodsId), quantity: quantity });

  res.json({ result: "success" });
});

// 장바구니 상품 수량 수정 API
router.put("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    res.status(400).json({ errorMessage: "수량은 1 이상이어야 합니다." });
    return;
  }

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });
  if (existsCarts.length) {
    await Cart.updateOne({ goodsId: Number(goodsId) }, { $set: { quantity } });
  }

  res.json({ success: true });
});

// 장바구니 상품 제거 API
router.delete("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;

  const existsCarts = await Cart.find({ goodsId });
  if (existsCarts.length > 0) {
    await Cart.deleteOne({ goodsId });
  }

  res.json({ result: "success" });
});


/** Router를 app.js에서 사용하기 위해 export **/
module.exports = router;