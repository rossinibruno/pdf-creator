const autentique = require("autentique-v2");
const promisify = require("promisify-node");
const fs = require("fs");
const supabase = require("./supabase");
const rmFile = promisify(fs.rm);

autentique.token = process.env.AUTENTIQUE_TOKEN;
autentique.sandbox = true;

module.exports = {
  createDocument: async (fileName, negotiationId) => {
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

    const response = await autentique.default.document.create(attributes);

    const documentId = response.data.createDocument.id;
    console.log(JSON.stringify({ documentId, negotiationId }));

    const supabaseResponse = await supabase
      .from("negotiations")
      .update({
        contractId: documentId,
      })
      .eq("id", negotiationId);

    console.log(supabaseResponse);

    if (!response.errors) {
      console.log(`${fileName} deleted`);
      await rmFile(`./pdf/${fileName}`);
    }
  },
  getDocument: async (documentId) =>
    await autentique.default.document.listById(documentId),
};
