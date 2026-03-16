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
  `${SITE}/hra-calculator`,
  `${SITE}/salary-calculator`,
  `${SITE}/sip-calculator`,
  `${SITE}/hra-calculator/mumbai`,
  `${SITE}/hra-calculator/delhi`,
  `${SITE}/hra-calculator/kolkata`,
  `${SITE}/hra-calculator/chennai`,
  `${SITE}/hra-calculator/bangalore`,
  `${SITE}/hra-calculator/hyderabad`,
  `${SITE}/hra-calculator/pune`,
  `${SITE}/hra-calculator/ahmedabad`,
  `${SITE}/hra-calculator/gurgaon`,
  `${SITE}/hra-calculator/noida`,
  `${SITE}/hra-calculator/jaipur`,
  `${SITE}/hra-calculator/lucknow`,
  `${SITE}/hra-calculator/chandigarh`,
  `${SITE}/hra-calculator/indore`,
  `${SITE}/hra-calculator/coimbatore`,
  `${SITE}/hra-calculator/nagpur`,
  `${SITE}/hra-calculator/patna`,
  `${SITE}/hra-calculator/bhubaneswar`,
  `${SITE}/hra-calculator/guwahati`,
  `${SITE}/salary-calculator/3-lpa`,
  `${SITE}/salary-calculator/4-lpa`,
  `${SITE}/salary-calculator/5-lpa`,
  `${SITE}/salary-calculator/6-lpa`,
  `${SITE}/salary-calculator/8-lpa`,
  `${SITE}/salary-calculator/10-lpa`,
  `${SITE}/salary-calculator/12-lpa`,
  `${SITE}/salary-calculator/15-lpa`,
  `${SITE}/salary-calculator/20-lpa`,
  `${SITE}/salary-calculator/25-lpa`,
  `${SITE}/salary-calculator/30-lpa`,
  `${SITE}/salary-calculator/40-lpa`,
  `${SITE}/salary-calculator/50-lpa`,
  `${SITE}/salary-calculator/75-lpa`,
  `${SITE}/salary-calculator/1-crore`,
  `${SITE}/salary-calculator/1.5-crore`,
  `${SITE}/sip-calculator/1-crore`,
  `${SITE}/sip-calculator/retirement`,
  `${SITE}/sip-calculator/child-education`,
  `${SITE}/sip-calculator/house-down-payment`,
  `${SITE}/sip-calculator/emergency-fund`,
  `${SITE}/sip-calculator/financial-freedom`,
  `${SITE}/sip-calculator/car-purchase`,
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
