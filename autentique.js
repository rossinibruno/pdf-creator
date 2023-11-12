const autentique = require("autentique-v2");
const fs = require("fs");

const rmFile = (path, opts = "utf8") =>
  new Promise((resolve, reject) => {
    fs.rm(path, opts, (err, data) => {
      if (err) reject(err);
      else {
        console.log(`${path} deleted`);
        resolve(data);
      }
    });
  });

module.exports = createDocument = async (fileName) => {
  const attributes = {
    document: {
      name: "NOME DO DOCUMENTO",
    },
    signers: [
      {
        email: "brunorossini@live.com",
        action: "SIGN",
        //   positions: [
        //     {
        //       x: "50", // Posição do Eixo X da ASSINATURA (0 a 100)
        //       y: "80", // Posição do Eixo Y da ASSINATURA (0 a 100)
        //       z: "1", // Página da ASSINATURA
        //     },
        //     {
        //       x: "50", // Posição do Eixo X da ASSINATURA (0 a 100)
        //       y: "50", // Posição do Eixo Y da ASSINATURA (0 a 100)
        //       z: "2", // Página da ASSINATURA
        //     },
      },
      {
        phone: "+5527988712217",
        action: "SIGN",
        delivery_method: "DELIVERY_METHOD_WHATSAPP",
      },
    ],
    file: `http://100.24.228.12:3000/static/${fileName}`,
  };

  autentique.token = process.env.AUTENTIQUE_TOKEN;
  autentique.sandbox = true;

  const response = await autentique.default.document.create(attributes);
  console.log(response);

  await rmFile(`./pdf/${fileName}`);
};
