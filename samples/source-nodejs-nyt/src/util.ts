import { promises as fs } from "fs";
import path from "path";
import { Session } from "@supabase/supabase-js";

const dataDirectory = ".settings";

export async function saveSessionInfo(session: Session) {
  const filePath = path.join(dataDirectory, "session.json");
  const sessionString = JSON.stringify(session);
  try {
    await fs.writeFile(filePath, sessionString);
  } catch (err) {
    console.error("Failed to save session token:", err);
  }
}

export async function readSessionInfo() {
  const filePath = path.join(dataDirectory, "session.json");
  try {
    const data = await fs.readFile(filePath, { encoding: "utf-8" });
    const session = JSON.parse(data);
    return session;
  } catch (err) {
    console.error("Failed to read session token.");
  }
}

export async function processApiError(response: Response) {
  console.error("Request failed:", response.statusText);
  let errorMessage = "";
  try {
    errorMessage = await response.json();
    console.log(errorMessage);
  } catch (error) {
    console.log("Could not process error message");
  }
  return;
}
