const PORT = 3000;

const express = require("express");
const app = express();
const basicAuth = require("express-basic-auth");

app.use(
  basicAuth({
    users: { admin: "supersecret" },
  })
);

app.post("/", function (req, res) {
  res.send("rota funcionando");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
