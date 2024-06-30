import { Session, SupabaseClient, createClient } from "@supabase/supabase-js";
import { Database } from "./types.gen.js";
import { readSessionInfo, saveSessionInfo } from "../util.js";

export class Supa {
  static instance: Supa | null = null;
  static getInstance() {
    if (!Supa.instance) {
      Supa.instance = new Supa();
    }
    return Supa.instance;
  }
  #supabase: SupabaseClient<Database> | null = null;

  constructor() {
    if (!this.#supabase) {
      this.createClient();
    }
  }

  createClient() {
    this.#supabase = createClient<Database>(
      process.env.SUPABASE_URL ?? "",
      process.env.SUPABASE_KEY ?? ""
    );
  }

  getClient(): SupabaseClient<Database> {
    return this.#supabase as SupabaseClient<Database>;
  }

  async setSession(session: Session) {
    await saveSessionInfo(session);
  }

  async checkSession() {
    let result = true;
    try {
      const resp1 = await (this.#supabase as SupabaseClient).auth.getSession();
      if (resp1.error) {
        result = false;
      }
      if (!resp1.data.session) {
        const savedSession = (await readSessionInfo()) as Session;
        const resp2 = await (this.#supabase as SupabaseClient).auth.setSession(
          savedSession
        );
        if (resp2.error || !resp2.data.session) {
          result = false;
        }
      }
    } catch (err) {
      result = false;
    }
    if (!result) {
      console.log("Session not found, please login first.");
      return false;
    }
    return true;
  }
}
