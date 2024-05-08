import * as cheerio from "cheerio";
import { ofetch } from "ofetch";

import { MetadataExtractors } from "$lib/services/metadata/extractors";
import { extractDescription, extractFavicon, extractImage, extractSitename, extractTitle } from "$lib/services/metadata/utils";
import { getPrimaryDomainName } from "$lib/utils/metadata";
import type { Metadata } from "$types/bookmark";

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

const fetchIframelyMetadata = async (url: string) => {
    return await ofetch<{
        url: string,
        meta: {
            title: string,
            description: string,
            site: string,
        },
        links: {
            thumbnail: Array<{
                href: string,
                type: string,
                media: {
                    width: number,
                    height: number,
                },
            }>
        }
    }>("https://iframe.ly/api/iframely", {
        method: "GET",
        params: {
            url,
            api_key: "f7caa2af6dd7bbd615c576",
        },
    });
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

    const metadata: Metadata = {
        title: extractTitle($)!,
        description: extractDescription($)!,
        image_url: extractImage($) || extractFavicon($, responseUrl),
        sitename: extractSitename($, responseUrl),
        domain: urlObject.hostname,
        url,
    };

    if (!metadata.title || !metadata.description) {
        const iframeMetadata = await fetchIframelyMetadata(url);
        metadata.title = iframeMetadata.meta.title || metadata.title;
        metadata.description = iframeMetadata.meta.description || metadata.description;
        metadata.image_url = iframeMetadata.links.thumbnail[0]?.href || metadata.image_url;
        metadata.url = iframeMetadata.url || metadata.url;
    }

    return metadata;
};
