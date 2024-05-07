import type { CheerioAPI } from "cheerio";

export const extractTitle = ($: CheerioAPI) => {
  return $("meta[property=\"og:title\"]")?.attr("content")
        || $("meta[name=\"title\"]")?.attr("content");
};

export const extractDescription = ($: CheerioAPI) => {
  return $("meta[property=\"og:description\"]")?.attr("content")
        || $("meta[name=\"description\"]")?.attr("content");
};

export const extractImage = ($: CheerioAPI) => {
  return $("meta[property=\"og:image\"]")?.attr("content")
        || $("#landingImage")?.attr("src"); // Amazon
};

export const extractFavicon = ($: CheerioAPI, url: string) => {
  const urlObject = new URL(url);
  return `https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=256`;
};

export const extractSitename = ($: CheerioAPI, url: string) => {
  const urlObject = new URL(url);
  const tab = urlObject.hostname.split(".");
  const str = tab[tab.length - 2];
  const sitename = str.charAt(0).toUpperCase() + str.slice(1);

  return $("meta[property=\"og:site_name\"]")?.attr("content") || sitename;
};
