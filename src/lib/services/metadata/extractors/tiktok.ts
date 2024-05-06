import axios from "axios";

type Response = {
  title: string
  description: string
  author_name: string
  thumbnail_url: string
  provider_url: string
  provider_name: string
  hostname: string
}

export const extractTikTokMetadata = async (url: string) => {
  const { data } = await axios.get<Response>("https://www.tiktok.com/oembed", {
    params: { url },
  });

  const domainUrl = new URL(data.provider_url);

  return {
    title: data.author_name,
    description: data.title,
    image_url: data.thumbnail_url,
    sitename: data.provider_name,
    domain: domainUrl.hostname,
    url,
  };
};
