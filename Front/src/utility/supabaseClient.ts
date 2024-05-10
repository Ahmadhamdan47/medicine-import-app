import { createClient } from "@refinedev/supabase";

const SUPABASE_URL = "https://ameetglstnzmupdyqhar.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtZWV0Z2xzdG56bXVwZHlxaGFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3Mjg0MzksImV4cCI6MjAyODMwNDQzOX0.tr39yHdpQ-lq2iP_FSifClCk_YysZY7EkbRw2Ljjhpc";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  db: {
    schema: "public",
  },
  // auth: {
  //   persistSession: true,
  // },
});
