require("dotenv").config();

const Queue = require("bee-queue");
const express = require("express");
const app = express();
const basicAuth = require("express-basic-auth");

const createPdf = require("./htmltopdf");

const options = {
  removeOnSuccess: true,
  redis: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
};

const queue = new Queue("pdf-creator", options);

app.use(
  basicAuth({
    users: { admin: "supersecret" },
  })
);
app.use(express.json());

app.post("/", function (req, res) {
  const { name } = req.body;

  queue.createJob({ name }).save();

  res.send("Adicionado a fila para criação de documento");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

queue.process(function (job, done) {
  console.log(`Processing job ${job.id}`);

  createPdf(job.data, "arquivo.pdf");

  return done(null, job.data);
});
