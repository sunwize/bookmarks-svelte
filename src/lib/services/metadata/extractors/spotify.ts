import { ofetch } from "ofetch";

type Response = {
  title: string
  description: string
  author_name: string
  thumbnail_url: string
  provider_url: string
  provider_name: string
  hostname: string
}

export const extractSpotifyMetadata = async (url: string) => {
  const data = await ofetch<Response>("https://open.spotify.com/oembed", {
    method: "GET",
    params: { url },
  });

  const domainUrl = new URL(data.provider_url);

  return {
    title: data.title,
    description: data.provider_name,
    image_url: data.thumbnail_url,
    sitename: data.provider_name,
    domain: domainUrl.hostname,
    url,
  };
};
