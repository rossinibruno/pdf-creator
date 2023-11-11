const { html } = require("@prairielearn/html");
const { renderEjs } = require("@prairielearn/html-ejs");

const wkhtmltopdf = require("wkhtmltopdf");

const renderHtml = (params) =>
  html`${renderEjs(__filename, "<%- include('./document'); %>", {
    ...params,
  })}`.toString();

module.exports = createPdf = (params, filename) => {
  const html = renderHtml(params);

  wkhtmltopdf(html).pipe(fs.createWriteStream(`${filename}.pdf`));
};
