const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json()); // IMPORTANT

app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.use("/img", express.static(`${__dirname}/data/img`));

app.use("/public", express.static(`${__dirname}/../frontend/public`));

app.get("/pizzas", (req, res) => {
  fs.readFile(`${__dirname}/data/data.json`, (err, data) => {
    if (err) {
      console.log("hiba:", err);
      res.status(500).send("hibavan");
    } else {
      res.status(200).send(JSON.parse(data));
    }
  });
});

app.post("/", (req, res) => {
  const now = new Date();

  const fileData = JSON.parse(JSON.stringify(req.body));

  const fileDataString = JSON.stringify(fileData, null, 2);
  const uploadPath = __dirname + "/../backend/data/" + `order`; //`order/${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}-${now.getMilliseconds()}.json`;

  fs.writeFileSync(uploadPath, fileDataString, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  });

  return res.send(fileDataString);
});

app.listen(2222, console.log("server listening on http://127.0.0.1:2222"));
