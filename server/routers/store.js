const express = require("express");
const router = express.Router();
const storeDB = require("../models/Store");
const serverURI = "http://localhost:8080";
// const serverURI = "http://61.85.79.234:19132";

// * 전체 매장 조회 api
router.get("", (req, res) => {
  storeDB.find((err, stores) => {
    if (err) return res.status(500).send({ error: "database failure" });
    res.json(stores);
  });
});

// * 매장 추가 api
router.post("", (req, res) => {
  const post = req.body;
  let store;

  if (post.coupon === "할인쿠폰") {
    store = new storeDB({
      name: post.name,
      latitude: post.latitude,
      longitude: post.longitude,
      branch: post.branch,
      description: post.description,
      address: post.address,
      backgroundImage: `${serverURI}/public/images/${post.name}/BG.jpg`,
      thumbnail: `${serverURI}/public/images/${post.name}/TN.jpg`,
      phone: post.phone,
      coupon: post.coupon,
      category: post.category,
      couponName: post.couponName,
      price: post.price,
      ratio: post.ratio
    });
  } else {
    store = new storeDB({
      name: post.name,
      latitude: post.latitude,
      longitude: post.longitude,
      branch: post.branch,
      description: post.description,
      address: post.address,
      backgroundImage: `${serverURI}/public/images/${post.name}/BG.jpg`,
      thumbnail: `${serverURI}/public/images/${post.name}/TN.jpg`,
      phone: post.phone,
      coupon: post.coupon,
      category: post.category,
      couponName: post.couponName
    });
  }

  store.save(err => {
    if (err) {
      console.error(err);
      res.json({ result: 0 });
      return;
    }
    res.json({ result: 1, message: "가게 추가됨" });
  });
});

// * 카테고리별 매장 정보 전달해 주기 (한글)
router.get("/category", (req, res) => {
  const category = req.body.category;

  storeDB.find({ category: category }, (err, stores) => {
    if (err) return res.status(500).send({ error: "database failure" });
    res.json(stores);
  });
});

// * 쿠폰별 매장 검색 (한글)
router.get("/coupon/", (req, res) => {
  const coupon = req.body.coupon;

  storeDB.find({ coupon: coupon }, (err, stores) => {
    if (err) return res.status(500).send({ error: "database failure" });
    res.json(stores);
  });
});

// * 검색어로 매장 검색(body)
router.get("/search", (req, res) => {
  const storeName = req.body.name;
  storeDB.find({ name: { $regex: `^${storeName}` } }, (err, stores) => {
    if (err) return res.status(500).send({ error: "search failure" });
    res.json(stores);
  });
});

// * id로 매장 검색
router.get("/search/:id", (req, res) => {
  const id = req.params.id;
  storeDB.findOne({ _id: id }, (err, store) => {
    if (err) return res.status(500).send({ error: "search failure" });
    res.json(store);
  });
});

// * 정확한 이름으로 검색, 매장이 존재하는지 확인 (쿠폰찍기에 사용)
router.get("/search-name", (req, res) => {
  const post = req.body;
  storeDB.findOne({ name: post.name, branch: post.branch }, (err, stores) => {
    if (err) return res.status(500).send({ error: "search failure" });
    if (stores.length === 0) {
      res.json({ result: 0 });
    } else {
      res.json({ result: 1, stores });
    }
  });
});

// * 매장 삭제
router.delete("/:id", (req, res) => {
  storeDB.remove({ _id: req.params.id }, (err, output) => {
    if (err) return res.status(500).json({ error: "database failure" });

    // if (!output.result.n)
    //   return res.status(404).json({ error: "book not found" });
    // res.json({ message: "book deleted" });

    res.status(204).end();
  });
});

// // * 카테고리별 매장 정보 전달해 주기
// router.get("/category/:data", (req, res) => {
//   const category = req.params.data;

//   storeDB.find({ category: category }, (err, stores) => {
//     if (err) return res.status(500).send({ error: "database failure" });
//     res.json(stores);
//   });
// });

// // * 쿠폰별 매장 검색
// router.get("/coupon/:data", (req, res) => {
//   const coupon = req.param.data;

//   storeDB.find({ coupon: req.params.data }, (err, stores) => {
//     if (err) return res.status(500).send({ error: "database failure" });
//     res.json(stores);
//   });
// });
// // * 검색어로 매장 검색
// router.get("/search/:name", (req, res) => {
//   const storeName = req.params.name;
//   storeDB.find({ name: { $regex: `^${storeName}` } }, (err, stores) => {
//     if (err) return res.status(500).send({ error: "search failure" });
//     res.json(stores);
//   });
// });

module.exports = router;
