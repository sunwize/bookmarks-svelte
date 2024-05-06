import { extractSpotifyMetadata } from "$lib/services/metadata/extractors/spotify";
import { extractTikTokMetadata } from "$lib/services/metadata/extractors/tiktok";
import type { Metadata } from "$types/bookmark";

export const MetadataExtractors: Record<string, (url: string) => Promise<Metadata>> = {
  "tiktok.com": extractTikTokMetadata,
  "spotify.com": extractSpotifyMetadata,
};
