import { ofetch } from "ofetch";

import { env } from "$env/dynamic/public";

type ApiResponse = {
  title: string
  description: string
  url: string
  images: string[]
  sitename: string
  favicon: string
  domain: string
}

const api = ofetch.create({
  baseURL: "https://jsonlink.io",
  params: {
    api_key: env.PUBLIC_JSON_LINK_API_KEY,
  },
});

export const loadMetadata = async (url: string) => {
  const data = await api<ApiResponse>("/api/extract", {
    method: "GET",
    params: {
      url,
    },
  });

  return {
    title: data.title,
    description: data.description,
    url: data.url,
    image_url: data.images[0],
    sitename: data.sitename,
    domain: data.domain,
  };
};
