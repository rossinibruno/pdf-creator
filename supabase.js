// const { createClient } = require("@supabase/supabase-js");

// const { SUPABASE_PROJECT, SUPABASE_TOKEN } = process.env;

// module.exports = supabase = createClient(
//   `https://${SUPABASE_PROJECT}.supabase.co`,
//   `${SUPABASE_TOKEN}`
// );

const fetch = require("node-fetch");
const FormData = require("form-data");

const API_URL = process.env.SUPABASE_URL;
const AUTH_TOKEN = process.env.SUPABASE_TOKEN;

/**
 * @async
 * @param {string} path
 * @param {ReadableStream} stream
 * @returns {void}
 */
module.exports = async function upload(path, stream) {
  const form = new FormData();
  form.append("", stream);

  const result = await fetch(`${API_URL}/storage/v1/object/documents/${path}`, {
    method: "POST",
    body: form,
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      apikey: AUTH_TOKEN,
    },
  });

  return result;
};
