import { BetaAnalyticsDataClient } from "@google-analytics/data";


console.log(process.env?.GA_CLIENT_EMAIL);

const client = new BetaAnalyticsDataClient({
credentials:{
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, "\n"),
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    client_id: process.env.CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
}
});

// Replace with your GA4 property ID
const propertyId = 506284738;


/**
 * Get page views for a specific path
 */
export async function getPageViews(pathName) {
  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "2025-09-01", endDate: "today" }], // full history
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: {
          value: pathName,
          matchType: "EXACT", // strict match
        },
      },
    },
  });

  return response.rows
    ? response.rows.reduce(
        (total, row) => total + Number(row.metricValues[0].value || 0),
        0
      )
    : 0;
}


/**
 * Get custom event count (e.g., button clicks)
 */
export async function getEventCount(eventName) {
  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: {
      filter: { fieldName: "eventName", stringFilter: { value: eventName } },
    },
  });

  return response.rows?.[0]?.metricValues?.[0]?.value || 0;
}