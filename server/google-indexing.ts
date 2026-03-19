import { createSign } from "crypto";
import { log } from "./index";

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
  `${SITE}/hra-calculator/jaipur`,
  `${SITE}/hra-calculator/surat`,
  `${SITE}/hra-calculator/lucknow`,
  `${SITE}/hra-calculator/nagpur`,
  `${SITE}/hra-calculator/indore`,
  `${SITE}/hra-calculator/bhopal`,
  `${SITE}/hra-calculator/visakhapatnam`,
  `${SITE}/hra-calculator/patna`,
  `${SITE}/hra-calculator/vadodara`,
  `${SITE}/hra-calculator/coimbatore`,
  `${SITE}/hra-calculator/kochi`,
  `${SITE}/salary-calculator/3-lpa`,
  `${SITE}/salary-calculator/4-lpa`,
  `${SITE}/salary-calculator/5-lpa`,
  `${SITE}/salary-calculator/6-lpa`,
  `${SITE}/salary-calculator/7-lpa`,
  `${SITE}/salary-calculator/8-lpa`,
  `${SITE}/salary-calculator/9-lpa`,
  `${SITE}/salary-calculator/10-lpa`,
  `${SITE}/salary-calculator/12-lpa`,
  `${SITE}/salary-calculator/15-lpa`,
  `${SITE}/salary-calculator/18-lpa`,
  `${SITE}/salary-calculator/20-lpa`,
  `${SITE}/salary-calculator/25-lpa`,
  `${SITE}/salary-calculator/30-lpa`,
  `${SITE}/salary-calculator/40-lpa`,
  `${SITE}/salary-calculator/50-lpa`,
  `${SITE}/sip-calculator/retirement`,
  `${SITE}/sip-calculator/house-purchase`,
  `${SITE}/sip-calculator/child-education`,
  `${SITE}/sip-calculator/emergency-fund`,
  `${SITE}/sip-calculator/car-purchase`,
  `${SITE}/sip-calculator/vacation`,
  `${SITE}/sip-calculator/wedding`,
];

function base64url(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64urlFromBuffer(buf: Buffer): string {
  return buf.toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function mintJwt(clientEmail: string, privateKey: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));
  const signingInput = `${header}.${payload}`;
  const sign = createSign("RSA-SHA256");
  sign.update(signingInput);
  const signature = base64urlFromBuffer(sign.sign(privateKey));
  return `${signingInput}.${signature}`;
}

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const jwt = mintJwt(clientEmail, privateKey);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Token exchange failed (${res.status}): ${body}`);
  }
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

async function notifyUrl(url: string, accessToken: string): Promise<boolean> {
  const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ url, type: "URL_UPDATED" }),
  });
  return res.ok;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitToGoogleIndexing(urls: string[] = SITE_URLS): Promise<{ success: boolean; submitted: number; failed: number; message: string }> {
  const raw = process.env.GOOGLE_INDEXING_SERVICE_ACCOUNT;
  if (!raw) {
    const msg = "Google Indexing: GOOGLE_INDEXING_SERVICE_ACCOUNT secret not set — skipping";
    log(msg, "google-indexing");
    return { success: false, submitted: 0, failed: 0, message: msg };
  }

  let credentials: { client_email: string; private_key: string };
  try {
    credentials = JSON.parse(raw);
  } catch {
    const msg = "Google Indexing: failed to parse service account JSON — skipping";
    log(msg, "google-indexing");
    return { success: false, submitted: 0, failed: 0, message: msg };
  }

  let accessToken: string;
  try {
    accessToken = await getAccessToken(credentials.client_email, credentials.private_key);
  } catch (err: any) {
    const msg = `Google Indexing: auth failed — ${err?.message || err}`;
    log(msg, "google-indexing");
    return { success: false, submitted: 0, failed: 0, message: msg };
  }

  let submitted = 0;
  let failed = 0;

  for (let i = 0; i < urls.length; i++) {
    try {
      const ok = await notifyUrl(urls[i], accessToken);
      if (ok) submitted++; else failed++;
    } catch {
      failed++;
    }
    if (i < urls.length - 1) await sleep(200);
  }

  const msg = `Google Indexing: submitted ${submitted}/${urls.length} URLs (${failed} failed)`;
  log(msg, "google-indexing");
  return { success: failed === 0, submitted, failed, message: msg };
}

export function scheduleGoogleIndexingOnStartup(): void {
  if (process.env.NODE_ENV !== "production") {
    log("Google Indexing: skipping auto-submit in development", "google-indexing");
    return;
  }
  setTimeout(async () => {
    log("Google Indexing: auto-submitting all URLs after startup...", "google-indexing");
    await submitToGoogleIndexing();
  }, 5000);
}
