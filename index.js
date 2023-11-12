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

const pdfQueue = new Queue("pdf-creator", options);
const autentiqueQueue = new Queue("autentique", options);

app.use(express.json());
app.use("/static", express.static("pdf"));

// app.use(
//   basicAuth({
//     users: { admin: "supersecret" },
//   })
// );

app.post("/", async function (req, res) {
  const { name } = req.body;

  // const job = pdfQueue.createJob({ name });
  // const job = autentiqueQueue.createJob({ fileName: "arquivo61.pdf" });

  // await job.save();

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
    file: `http://100.24.228.12:3000/static/documento61.pdf`,
  };

  autentique.token = process.env.AUTENTIQUE_TOKEN;
  console.log(process.env.AUTENTIQUE_TOKEN);

  console.log(await autentique.default.document.create(attributes));

  res.send("Adicionado a fila para criação de documento");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

pdfQueue.process(async function (job, done) {
  console.log(`pdf-creator job ${job.id}`);

  await createPdf(job.data, `arquivo${job.id}`);

  const autentiqueJob = autentiqueQueue.createJob({
    fileName: `arquivo${job.id}.pdf`,
  });

  await autentiqueJob.save();

  return done(null, job.data);
});

autentiqueQueue.process(async function (job, done) {
  console.log(`autentique job ${job.id}`);

  return done(null, job.data);
});
