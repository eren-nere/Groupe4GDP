require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

function supabaseEnvValid() {
  return Boolean(supabaseUrl && supabaseServiceKey);
}

if (!supabaseEnvValid()) {
  // eslint-disable-next-line no-console
  console.warn('Supabase non configuré: définissez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = supabaseEnvValid()
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : null;

module.exports = { supabase };


