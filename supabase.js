const { createClient } = require("@supabase/supabase-js");

const { SUPABASE_PROJECT, SUPABASE_TOKEN } = process.env;

module.exports = supabase = createClient(
  `https://${SUPABASE_PROJECT}.supabase.co`,
  `${SUPABASE_TOKEN}`
);
