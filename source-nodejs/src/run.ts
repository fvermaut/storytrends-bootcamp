#!/usr/bin/env node

import { Supa } from "./supabase/client.js";

async function main() {
  if (!(await Supa.getInstance().checkSession())) return;
  const resp = await Supa.getInstance()
    .getClient()
    .from("user_projects")
    .select(
      "id, name, req_status, req_type, projects(status, target_status, error_message)"
    );
  console.log(resp);
}
console.log(`HELLO! ${process.argv}`);
//await new Promise((resolve) => setTimeout(resolve, 5000000));

await main();
