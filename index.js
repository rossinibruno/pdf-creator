require("dotenv").config();

const Queue = require("bee-queue");
const express = require("express");
const app = express();
const basicAuth = require("express-basic-auth");
const autentique = require("autentique-v2");

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

app.post("/", async function (req, res) {
  const { name } = req.body;

  const job = queue.createJob({ name });

  await job.save();

  res.send("Adicionado a fila para criação de documento");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

queue.process(async function (job, done) {
  console.log(`Processing job ${job.id}`);

  // await createPdf(job.data, `arquivo${job.id}`);

  const attributes = {
    document: {
      name: "NOME DO DOCUMENTO",
    },
    signers: [
      {
        email: "email@email.com",
        action: "SIGN",
        positions: [
          {
            x: "50", // Posição do Eixo X da ASSINATURA (0 a 100)
            y: "80", // Posição do Eixo Y da ASSINATURA (0 a 100)
            z: "1", // Página da ASSINATURA
          },
          {
            x: "50", // Posição do Eixo X da ASSINATURA (0 a 100)
            y: "50", // Posição do Eixo Y da ASSINATURA (0 a 100)
            z: "2", // Página da ASSINATURA
          },
        ],
      },
      {
        email: "email@email.com",
        action: "SIGN",
      },
    ],
    file: "https://jucisrs.rs.gov.br/upload/arquivos/201710/30150625-criacao-de-pdf-a.pdf",
  };

  autentique.document.create(attributes);

  return done(null, job.data);
});
