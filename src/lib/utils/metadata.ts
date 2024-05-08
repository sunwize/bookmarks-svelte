import { api } from "$lib/services/api";
import { loadMetadata } from "$lib/services/jsonlink";
import { MetadataExtractors } from "$lib/services/metadata/extractors";
import type { Metadata } from "$types/bookmark";

export const getPrimaryDomainName = (url: string) => {
  const urlObject = new URL(url);
  const tab = urlObject.hostname.split(".");
  return tab.slice(tab.length - 2, tab.length).join(".");
};

export const extractMetadata = async (url: string) => {
  const domainName = getPrimaryDomainName(url);
  let metadata: Metadata | null = null;

  if (!Object.keys(MetadataExtractors).includes(domainName)) {
    metadata = await loadMetadata(url);
  }

  if (!metadata || !metadata.title || !metadata.description) {
    const { data } = await api.get("/api/metadata", {
      params: { url },
    });

    metadata = data;
  }

  return metadata;
};

const extractUrlFromString = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);

    return urls?.[0];
};

export const getSharedUrl = () => {
  const params = new URLSearchParams(window.location.search);

  for (const key of ["title", "description", "name", "text", "url"]) {
    const param = extractUrlFromString(params.get(key) || "");

    if (param) {
      return param;
    }
  }
};
