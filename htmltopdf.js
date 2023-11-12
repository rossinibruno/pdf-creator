const { html } = require("@prairielearn/html");
const { renderEjs } = require("@prairielearn/html-ejs");
const fs = require("fs");
const supabase = require("./supabase");
const autentique = require("autentique-v2");

const wkhtmltopdf = require("wkhtmltopdf");

const renderHtml = (params) =>
  html`${renderEjs(__filename, "<%- include('./document'); %>", {
    ...params,
  })}`.toString();

module.exports = createPdf = async (params, filename) => {
  const html = renderHtml(params);

  return new Promise(function (resolve, reject) {
    const stream = fs.createWriteStream(`${filename}.pdf`);

    wkhtmltopdf(html).pipe(stream);

    stream.on("finish", async () => {
      console.log(html);

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

      await autentique.document.create(attributes);

      resolve();
    });
    stream.on("error", reject); // or something like that. might need to close `hash`
  });
};
