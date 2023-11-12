const { html } = require("@prairielearn/html");
const { renderEjs } = require("@prairielearn/html-ejs");
const fs = require("fs");

const upload = require("./supabase");

const wkhtmltopdf = require("wkhtmltopdf");
const supabase = require("./supabase");

const renderHtml = (params) =>
  html`${renderEjs(__filename, "<%- include('./document'); %>", {
    ...params,
  })}`.toString();

module.exports = createPdf = async (params, filename) => {
  const html = renderHtml(params);

  return new Promise(function (resolve, reject) {
    const stream = fs.createWriteStream(`./pdf/${filename}.pdf`);
    wkhtmltopdf(html).pipe(stream);

    stream.on("finish", async () => {
      console.log(`Save document ${filename}.pdf`);

      resolve();
    });
    stream.on("error", reject); // or something like that. might need to close `hash`
  });
};
