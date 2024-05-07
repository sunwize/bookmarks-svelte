import * as cheerio from "cheerio";

import { MetadataExtractors } from "$lib/services/metadata/extractors";
import { extractDescription, extractFavicon, extractImage, extractSitename, extractTitle } from "$lib/services/metadata/utils";
import { getPrimaryDomainName } from "$lib/utils/metadata";

const fetchHtml = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Origin: url,
    },
    redirect: "follow",
  });

  return {
    data: await response.text(),
    responseUrl: response.url,
  };
};

export const extractMetadata = async (url: string) => {
  const { data: html, responseUrl } = await fetchHtml(url);

  // Using the response url in case of redirects
  // For instance Amazon will redirect from https://a.co/... to https://www.amazon.ca/...
  const urlObject = new URL(responseUrl);
  const domainName = getPrimaryDomainName(responseUrl);

  if (domainName in MetadataExtractors) {
    const extractor = MetadataExtractors[domainName];
    return extractor(responseUrl);
  }

  const $ = cheerio.load(html);

  return {
    title: extractTitle($)!,
    description: extractDescription($)!,
    image_url: extractImage($) || extractFavicon($, responseUrl),
    sitename: extractSitename($, responseUrl),
    domain: urlObject.hostname,
    url,
  };
};
