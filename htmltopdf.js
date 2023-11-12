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

      resolve();
    });
    stream.on("error", reject); // or something like that. might need to close `hash`
  });
};
