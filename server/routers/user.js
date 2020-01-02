const express = require("express");
const router = express.Router();
const userDB = require("../models/User");
const cardDB = require("../models/Card");
const couponDB = require("../models/Coupon");
const serverURI = "http://localhost:8080";
const request = require("request");
const moment = require("moment");
require("moment-timezone");
// const serverURI = "http://61.85.79.234:19132";

// * 전체 유저 가져오기
router.get("", (req, res) => {
  userDB.find((err, users) => {
    if (err) return res.status(500).send({ error: "database failure" });
    res.json(users);
  });
});

// * 회원가입
router.post("", (req, res) => {
  const post = req.body;

  let user = new userDB({
    id: post.id,
    password: post.password,
    name: post.name,
    birthDate: post.birthDate,
    nickname: post.nickname,
    phone: post.phone,
    image: `${serverURI}/public/images/${post.name}/TN.jpg`,
    lastDate: 20190101,
    lastTime: 000000,
    card: [],
    coupon: []
  });

  user.save(err => {
    if (err) {
      console.error(err);
      res.json({ result: 0 });
      return;
    }

    res.json({ result: 1, message: "가입 성공" });
  });
});

// min ~ max사이의 랜덤 값 생성
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// * 로그인
router.get("/login", (req, res) => {
  userDB.find(
    { id: req.body.id, password: req.body.password },
    (err, users) => {
      if (err) return res.status(500).send({ error: "database failure" });
      console.log(`users length : ${users.length}`);
      if (users.length === 0)
        res.json({
          result: 0,
          message: "아이디 혹은 비밀번호가 일치하지 않습니다."
        });
      else {
        const random = getRandomInt(100000000, 999999999);
        moment.tz.setDefault("Asia/Seoul");
        const start_date = users[0].lastDate;
        console.log(`start_date : ${start_date}`);
        const end_date = moment().format("YYYYMMDD");
        const tran_time = moment().format("YYYYMMDDHHmmss");
        const client_u_num = `T991589370`;
        const bank_t_id = `${client_u_num}U${random}`;
        const Author_code = `de052ef2-1ce9-44b0-b90f-2c8a98b143aa`;
        const Authorization_code = `Bearer ${Author_code}`;
        const fintech_num = `199158937057879994434800`;
        const _url = `https://testapi.open-platform.or.kr/v2.0/account/transaction_list/fin_num?bank_tran_id=${bank_t_id}&fintech_use_num=${fintech_num}&inquiry_type=O&inquiry_base=D&from_date=${start_date}&to_date=${end_date}&sort_order=D&tran_dtime=${tran_time}`;

        request.get(
          {
            url: _url,
            json: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: Authorization_code
            }
          },
          (err, response, data) => {
            if (err) {
              console.log(`Error : ${err}`);
            } else if (response.statusCode !== 200) {
              console.log(`Status : ${response.statusCode}`);
            } else {
              console.log(data);
              const res_list = data.res_list;
              const page_count = data.page_record_cnt;
              res.json({ result: 1, users, page_count, res_list });
              users[0].lastDate = end_date;
              users[0].lastTime = moment().format("HHmmss");
              users[0].save(err => {
                if (err) console.log(err);
                return;
              });
            }
          }
        );
      }
    }
  );
});

// * 해당 매장에 대한 쿠폰이 사용자에게 있는지 확인, 있으면 +1, 없으면 추가
router.put("/coupon", (req, res) => {
  /**
   * TODO req.body가 가져야 할 데이터
   * * 1. _id : 사용자의 _id
   * * 2. branch_name : 사용자가 긁은 매장 이름
   * * 3. category : 해당 매장의 쿠폰 종류
   * * 4. store_id : 매장의 _id
   * * 5. price : 해당 매장이 할인쿠폰이면 쿠폰의 원래 가격
   * * 6. ratio : 해당 제품의 할인율
   * * 7. name : 쿠폰 이름
   * * 8. money : 결재한 금액
   */
  const post = req.body;
  // ! 1. 사용자 검색
  userDB.findOne({ _id: post._id }, (err, user) => {
    if (err) return res.status(500).send({ error: "search failure" });
    if (user === null)
      res.json({ result: 0, message: "user not found, _id is wrong" });
    else {
      let flag = false,
        oldCoupon;
      user.coupon.forEach(element => {
        if (element.storeName === post.branch_name) {
          flag = true;
          oldCoupon = element;
        }
      });
      // ! 2. 해당 사용자가 있으면 쿠폰이 있는지 검색
      console.log(`flag : ${flag}`);
      // ! 3-1. 해당 매장의 쿠폰이 없을 때 >> 쿠폰 추가
      if (flag === false) {
        let newCoupon;
        switch (post.category) {
          case "적립쿠폰":
          case "스탬프":
            newCoupon = new couponDB({
              type: "적립쿠폰",
              publishDate: moment().format("YYYY-MM-DD"),
              storeName: post.store_name,
              branch: post.branch_name,
              storeCategory: post.category,
              name: post.name,
              image: `http://${serverURI}/public/images/${post.store_name}/COUPON.jpg`,
              stampNumber: 0,
              store_id: post.store_id
            });
            break;
          case "할인쿠폰":
            newCoupon = new couponDB({
              type: "할인쿠폰",
              publishDate: moment().format("YYYY-MM-DD HH:mm:ss"),
              storeName: post.store_name,
              branch: post.branch_name,
              name: post.name,
              image: `http://${serverURI}/public/images/${post.store_name}/COUPON.jpg`,
              price: post.price,
              ratio: post.ratio,
              store_id: post.store_id
            });
            break;
        }
        user.coupon.push(newCoupon);
        user.save();
        res.json({ result: 1, message: "쿠폰 추가됨" });
      } else {
        // ! 3-2. 쿠폰이 있을 때 >> 쿠폰 수정, 스탬프만 수정된다.
        user.coupon = user.coupon.filter(
          cp => cp.storeName !== post.store_name
        );
        oldCoupon.stampNumber =
          oldCoupon.stampNumber + Math.floor(post.money / 5000);
        user.coupon.push(oldCoupon);
        user.save();
        res.json({ result: 1, message: "쿠폰 적립 됨" });
      }
    }
  });
});

// * 회원 한 명 정보 받기
router.get("/one", (req, res) => {
  userDB.findOne({ _id: req.body._id }, (err, users) => {
    if (err) return res.status(500).send({ error: "database failure" });
    if (users === null) {
      res.json({ result: 0, message: "일치하는 회원이 없습니다." });
    } else res.json(users);
  });
});

// * 해당 사용자의 카드 추가
router.put("/card", (req, res) => {
  const post = req.body.card;
  let newCard = new cardDB({
    number: post.number,
    name: post.name,
    expire: post.expire,
    accountNum: post.accountNum,
    bankName: post.bankName,
    cardImage: `${serverURI}/public/images/card/${post.bankName}/BG.jpg`
  });

  userDB.findOne({ _id: req.body._id }, (err, users) => {
    if (err) return res.status(500).send({ error: "database failure" });
    if (users === null) {
      res.json({ result: 0, message: "일치하는 회원이 없습니다." });
    } else {
      users.card.push(newCard);
      users.save();
      res.json({ result: 1, message: "카드 추가 완료" });
    }
  });
});

// * 해당 사용자의 모든 카드 받기
router.get("/allCard", (req, res) => {
  userDB.find({ _id: req.body._id }, { card: 1 }, (err, users) => {
    if (err) return res.status(500).send({ error: "database failure" });
    if (users === null) {
      res.json({ result: 0, message: "일치하는 회원이 없습니다." });
    } else res.json({ result: 1, users });
  });
});

// * 해당 사용자의 모든 쿠폰 전달
router.get("/allCoupon", (req, res) => {
  userDB.findOne({ _id: req.body._id }, { coupon: 1 }, (err, user) => {
    if (err) return res.status(500).send({ error: "database failure" });
    if (user === null) {
      res.json({ result: 0, message: "일치하는 회원이 없습니다." });
    } else res.json({ result: 1, user });
  });
});

// * 해당 사용자 삭제
router.delete("/:id", (req, res) => {
  userDB.remove({ _id: req.params.id }, (err, output) => {
    if (err) return res.status(500).json({ error: "database failure" });

    res.status(204).end();
  });
});

// * 사용자 카드 삭제
router.put("/card/del", (req, res) => {
  const post = req.body;
  userDB.findOne({ _id: post._id }, (err, user) => {
    if (err) return res.status(500).send({ error: "database failure" });
    if (user === null) res.json({ result: 0, message: "일치하는 회원 없음" });
    else {
      user.card = user.card.filter(card => card.number !== post.cardNumber);
      user.save();
      res.json({ result: 1, message: "카드 제거 완료" });
    }
  });
});

router.put("/coupon/use", (req, res) => {
  const post = req.body;
  userDB.findOne({ _id: post.user_id }, (err, user) => {
    if (err) return res.status(500).send({ error: "database failure" });
    if (post.type === "적립쿠폰") {
      const cp = user.coupon.filter(coup => coup._id == post.coupon_id);
      const objCP = cp[0];
      console.log(objCP.stampNumber);
      if (objCP.stampNumber >= 10) {
        user.coupon = user.coupon.filter(cp => cp._id != post.coupon_id);
        objCP.stampNumber -= 10;
        Math.floor(objCP.stampNumber);
        user.coupon.push(objCP);
        user.save();
        res.json({ result: 1, message: "적립쿠폰 10개 삭제" });
      } else {
        res.json({ result: 0, message: "쿠폰 도장이 10개 미만입니다." });
      }
    } else {
      user.coupon = user.coupon.filter(coup => coup._id != post.coupon_id);
      user.save();
      res.json({ result: 1, message: "할인쿠폰 삭제" });
    }
  });
});

module.exports = router;
