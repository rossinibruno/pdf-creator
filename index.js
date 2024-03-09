require("dotenv").config();

const Queue = require("bee-queue");
const express = require("express");
const app = express();
const cors = require("cors");
const basicAuth = require("express-basic-auth");
const createPdf = require("./htmltopdf");
const { createDocument, getDocument } = require("./autentique");

const options = {
  removeOnSuccess: true,
  redis: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
};

const pdfQueue = new Queue("pdf-creator", options);
const autentiqueQueue = new Queue("autentique", options);

app.use(cors());
app.use(express.json());
app.use("/static", express.static("pdf"));

app.use(
  basicAuth({
    users: { admin: "supersecret" },
  })
);

app.post("/", async function (req, res) {
  const { name, cnpj, negotiation } = req.body;

  const job = pdfQueue.createJob({ name, cnpj, negotiation });

  await job.save();

  res.send("Adicionado a fila para criação de documento");
});

app.get("/document/:id", async function (req, res) {
  const { id } = req.params;

  const response = await getDocument(id);

  res.send(response.data);
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

pdfQueue.process(async function (job, done) {
  console.log(`pdf-creator job ${job.id}`);

  await createPdf(job.data, `arquivo${job.id}`);

  console.log(job.data);

  const autentiqueJob = autentiqueQueue.createJob({
    fileName: `arquivo${job.id}.pdf`,
    negotiationId: job.data.negotiation.id,
  });

  await autentiqueJob.save();

  return done(null, job.data);
});

autentiqueQueue.process(async function (job, done) {
  console.log(`autentique job ${job.id} ${job.data.negotiationId}`);

  await createDocument(job.data.fileName, job.data.negotiationId);

  return done(null, job.data);
});
