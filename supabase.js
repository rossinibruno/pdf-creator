const { createClient } = require("@supabase/supabase-js");

const { SUPABASE_PROJECT, SUPABASE_TOKEN } = process.env;

const supabase = createClient(
  `https://${SUPABASE_PROJECT}.supabase.co`,
  `${SUPABASE_TOKEN}`,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

module.exports = supabase.auth.admin;
