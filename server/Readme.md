## npm install

- npm install express
- npm install mongoose
- npm install body-parser
- npm install moment
- npm install moment-timezone
- npm install request --save

---

# ITCOO Schema

## 1. User

| Key       |  Value type   |                   ex |                 설명 |
| --------- | :-----------: | -------------------: | -------------------: |
| \_id      |    Object     |                    - |          사용자 식별 |
| id        |    String     |            "paa0609" |               아이디 |
| password  |    String     |           "1q2w3e4r" |             비밀번호 |
| name      |    String     |             "김동우" |          사용자 이름 |
| birthDate |    String     |             "960101" |      사용자 생년월일 |
| nickName  |    String     |                "Hun" |               닉네임 |
| phone     |    String     |      "010-1234-1234" |             전화번호 |
| card      | Array[Object] |             [{}, {}] |          카드 정보들 |
| image     |    String     | 192.../userImage.jpg |        프로필 이미지 |
| coupon    | Array[Object] |                    - | 가지고있는 쿠폰 목록 |

> image 경로 : \${url}/public/images/회원이름/TN.jpg

### 1.1 User - card >>> User의 card배열에 들어가는 Object 정의

| Key        | Value type |                        ex |          설명 |
| ---------- | :--------: | ------------------------: | ------------: |
| \_id       |   Object   |                         - |  카드 식별 id |
| accountNum |   String   |               "352-0486-" |      계좌번호 |
| number     |   String   |             "1234-5678.." |      카드번호 |
| name       |   String   |            "LEE SANG HUN" |     카드 이름 |
| expire     |   String   |                   "07/22" | 카드 유효기간 |
| cardImage  |   String   | "http://192.../Image.jpg" |   카드 이미지 |
| bankName   |   String   |                "신한은행" |      은행이름 |

> cardImage 경로 : \${url}/public/images/은행이름/BG.jpg (bankName)

### 1.2 User - coupon >>> User의 coupon배열에 들어가는 Object의 정의

| Key           | Value type |                ex |                        설명 |
| ------------- | :--------: | ----------------: | --------------------------: |
| \_id          |   Object   |                 - |                쿠폰 식별 id |
| type          |   String   |        "적립쿠폰" |              쿠폰 식별 타입 |
| name          |   String   | "요거프레소 쿠폰" |                   쿠폰 이름 |
| publishDate   |   String   |      "2019-11-11" |                    발행날짜 |
| storeName     |   String   |      "요거프레소" |       쿠폰 발행한 매장 이름 |
| storeCategory |   String   |          "커피집" |            해당 매장의 타입 |
| image         |   String   |            URL... |                 쿠폰 이미지 |
| store_id      |   String   |   "0215684352..." |     쿠폰 발행한 매장의 \_id |
| stampNumber   |   Number   |                 6 |       도장 갯수(적립쿠폰만) |
| price         |   Number   |              3500 | 할인전 품목가격(할인쿠폰만) |
| ratio         |   Number   |              "10" |          할인율(할인쿠폰만) |

> type종류 : 적립쿠폰, 할인쿠폰<br>
> publishDate : 예제와 같은 형식으로 저장<br>
> image경로 : \${url}/public/images/매장이름/COUPON.jpg (storeName)<br>

---

## 2. Store

| Key             | Value type |               ex |                         설명 |
| --------------- | :--------: | ---------------: | ---------------------------: |
| \_id            |   Object   |                - |                 매장식별번호 |
| name            |   String   |           "설빙" |                    매장 이름 |
| longitude       |   Number   |        126.15748 |                    매장 경도 |
| latitude        |   Number   |          37.1548 |                    매장 위도 |
| branch          |   String   |       "동성로점" |                  매장 지점명 |
| description     |   String   |         "맛나요" |                    매장 설명 |
| address         |   String   |  "대구 동성로.." |                    매장 주소 |
| backgroundImage |   String   |     "/Image.jpg" |             매장 배경 이미지 |
| thumbNail       |   String   | "/Thumbnail.jpg" |           매장 썸네일 이미지 |
| phone           |   String   |     "010-1234.." |                매장 전화번호 |
| coupon          |   String   |       "적립쿠폰" |        해당 매장의 쿠폰 정보 |
| category        |   String   |         "서비스" |         해당 매장의 카테고리 |
| couponName      |   String   |  "설빙 적립쿠폰" | 해당 매장이 발행할 쿠폰 이름 |
| price           |   Number   |             6000 |      할인쿠폰의 할인 전 금액 |
| ratio           |   Number   |               10 |            할인쿠폰의 할인율 |

> backgroundImage : ${url}/public/images/매장이름/BG.jpg (name)<br>
> thumbNail : ${url}/public/images/매장이름/TN.jpg<br>
> Coupon종류 : 적립쿠폰, 할인쿠폰, 스탬프<br>
> Category종류 : 서비스, 마트, 음식점, 카페<br>
> price와 ratio는 쿠폰 종류가 할인쿠폰일때만 필요<br>

---

# 구현할 API

- 운열이 파트 (지도에 매장정보 올리기)

```
1. 모든 매장정보 전달
2. 카테고리별로 매장 정보 전달하기 (서비스, 마트, 음식점 카페)
   - 매장 정보가 body에 담겨오면 해당 매장 전체에 대한 정보 주기

3. 쿠폰별로 매장 정보 전달하기 (적립쿠폰, 할인쿠폰, 스탬프)
   - 쿠폰 종류가 body에 담겨오면 해당되는 매장 전체에 대한 정보 전달해 주기
```
