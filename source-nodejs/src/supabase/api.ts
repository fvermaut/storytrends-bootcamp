import { Supa } from "./client.js";
import { TablesInsert } from "./types.gen.js";

export async function upsertStories(stories: TablesInsert<"stories">[]) {
  const { data, error } = await Supa.getInstance()
    .getClient()
    .from("stories")
    .upsert(stories, {
      onConflict: "source_id, foreign_id",
      ignoreDuplicates: true,
    });
  if (error) {
    console.log(`error during database update: ${error.message}`);
    return false;
  }
  return true;
}
