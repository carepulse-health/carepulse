import { createMiddleware } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

/** Sends the signed-in user's session token with server function calls so the server can apply their RLS access. */
export const attachSupabaseAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  return next(
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
});
