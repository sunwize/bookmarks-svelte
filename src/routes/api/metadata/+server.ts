import { error, json, type RequestHandler } from "@sveltejs/kit";

import { extractMetadata } from "$lib/services/metadata";

export const GET: RequestHandler = async ({ url }) => {
  const bookmarkUrl = url.searchParams.get("url");

  if (!bookmarkUrl) {
    throw error(400, "Missing 'url' query parameter");
  }

  const metadata = await extractMetadata(bookmarkUrl);

  return json(metadata);
};
