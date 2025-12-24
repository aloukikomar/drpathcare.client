// src/utils/gtag.ts
export const GA_MEASUREMENT_ID = "G-ZMLBM5GTYV";

export const pageview = (url: string) => {
  if (!(window as any).gtag) return;

  (window as any).gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: document.title,
  });
};

export const event = (action: string, params: Record<string, any>) => {
  if (!(window as any).gtag) return;

  (window as any).gtag("event", action, params);
};
