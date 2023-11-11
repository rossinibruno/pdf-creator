const PORT = 3000;

const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send("rota funcionando");
});

app.post("/", function (req, res) {
  res.send("rota funcionando");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
