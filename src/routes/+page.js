import { redirect } from "@sveltejs/kit";
import { base } from "$app/paths";
import { goto } from "$app/navigation";
import { browser } from "$app/environment";

export async function load() {
  console.log("Redirecting to", `${base}/papers`);

  if (browser) {
    // goto(`${base}/papers`, { replaceState: true, invalidateAll: true });
  }
}
