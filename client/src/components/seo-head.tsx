import { useEffect } from "react";

const DEFAULT_OG_IMAGE = "https://mypaisahq.com/og-default.png";

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
  jsonLd?: object | object[];
}

function upsertMeta(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function SEOHead({ title, description, canonicalPath, ogImage, jsonLd }: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    const fullUrl = `https://mypaisahq.com${canonicalPath}`;
    const image = ogImage || DEFAULT_OG_IMAGE;

    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", fullUrl);
    upsertMeta("property", "og:image", image);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", fullUrl);

    if (jsonLd) {
      const existingScripts = document.querySelectorAll('script[data-seo-jsonld], script[data-seo-server]');
      existingScripts.forEach((s) => s.remove());

      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach((schema) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo-jsonld", "true");
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    return () => {
      const scripts = document.querySelectorAll('script[data-seo-jsonld]');
      scripts.forEach((s) => s.remove());
    };
  }, [title, description, canonicalPath, ogImage, jsonLd]);

  return null;
}
