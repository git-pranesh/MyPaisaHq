import { log } from "./index";

const INDEXNOW_KEY = "2eff04eeb1374409835369730a484489";
const SITE = "https://mypaisahq.com";

const SITE_URLS = [
  `${SITE}/`,
  `${SITE}/8th-pay-commission`,
  `${SITE}/gratuity`,
  `${SITE}/salary`,
  `${SITE}/hra`,
  `${SITE}/hike`,
  `${SITE}/income-tax`,
  `${SITE}/sip`,
  `${SITE}/loan-vs-sip`,
  `${SITE}/goal-sip`,
];

export async function submitToIndexNow(urls: string[] = SITE_URLS): Promise<{ success: boolean; status?: number; message: string }> {
  const payload = {
    host: "mypaisahq.com",
    key: INDEXNOW_KEY,
    keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const message = `IndexNow: submitted ${urls.length} URL(s) → HTTP ${response.status}`;
    log(message, "indexnow");

    if (response.status === 200 || response.status === 202) {
      return { success: true, status: response.status, message };
    } else {
      const body = await response.text().catch(() => "");
      const errMsg = `IndexNow: submission failed (${response.status}) ${body}`.trim();
      log(errMsg, "indexnow");
      return { success: false, status: response.status, message: errMsg };
    }
  } catch (err: any) {
    const errMsg = `IndexNow: network error — ${err?.message || err}`;
    log(errMsg, "indexnow");
    return { success: false, message: errMsg };
  }
}

export function scheduleIndexNowOnStartup(): void {
  if (process.env.NODE_ENV !== "production") {
    log("IndexNow: skipping auto-submit in development", "indexnow");
    return;
  }
  setTimeout(async () => {
    log("IndexNow: auto-submitting all URLs after startup...", "indexnow");
    await submitToIndexNow();
  }, 5000);
}
