const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");

// configure app to use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

mongoose.connect("mongodb://localhost/ITCOO");

// * configure router
const userRouter = require("./routers/user");
const storeRouter = require("./routers/store");
app.use("/user", userRouter);
app.use("/store", storeRouter);

app.get("/public/images/:store/:name", (req, res) => {
  const store = req.params.store;
  const filename = req.params.name;

  console.log(`store : ${store}, filename : ${filename}`);

  fs.readFile(`./public/images/${store}/${filename}`, (err, data) => {
    if (err) return res.status(500).send({ error: "database failure" });

    res.writeHead(200, { "Content-Type": "image/jpg" });
    res.write(data);
    res.end();
  });
});

const db = mongoose.connection;
db.on("error", console.error);
db.once("open", () => {
  // * connected to mongodb server
  console.log("connected to mongodb server");
});

const server = app.listen(port, () => {
  console.log(`Express server has started on port ${port}`);
});
