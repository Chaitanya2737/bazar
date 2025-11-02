import { BetaAnalyticsDataClient } from "@google-analytics/data";

const client = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    client_id: process.env.CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  },
});

const propertyId =  "506284738"; // fallback

// Helper function for running reports with error handling
async function runReport(request) {
  try {
    const [response] = await client.runReport(request);
    return response;
  } catch (error) {
    console.error("GA4 API Error:", error);
    return { rows: [] }; // Return empty to avoid crashes
  }
}

// ✅ Fetch total page views for a given path
export async function getPageViews(pathName, startDate = "2025-09-01") {
  const response = await runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate, endDate: "today" }],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: { value: pathName, matchType: "EXACT" },
      },
    },
  });

  return (
    response.rows?.reduce(
      (total, row) => total + Number(row.metricValues?.[0]?.value || 0),
      0
    ) || 0
  );
}

// ✅ Fetch event count (custom GA4 event)
export async function getEventCount(eventName) {
  const [response] = await runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: {
      filter: { 
        fieldName: "eventName", 
        stringFilter: { value: eventName, matchType: "EXACT" } // ✅ Added EXACT match
      },
    },
  });

  return Number(response.rows?.[0]?.metricValues?.[0]?.value || 0);
}




function getTodayAndStartDate(interval = "7d", tzOffsetMinutes = 330) {
  const now = new Date();
  const gaNow = new Date(now.getTime() + tzOffsetMinutes * 60 * 1000);

  const todayStr = gaNow.toISOString().slice(0, 10); // YYYY-MM-DD (GA timezone)
  const start = new Date(gaNow);
  const daysBack = interval === "30d" ? 30 : 7;
  start.setDate(start.getDate() - daysBack);
  const startStr = start.toISOString().slice(0, 10);

  return { todayStr, startStr };
}
/** ✅ Main Analytics Function (timezone-safe + filled daily) */
export async function getAnalyticsData(pathname = "/", interval = "7d") {
  const { todayStr, startStr } = getTodayAndStartDate(interval, 330); // Adjust if your GA property is in another zone

  let response = await runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: startStr, endDate: todayStr }],
    dimensions: [{ name: "date" }, { name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }, { name: "totalUsers" }],
    dimensionFilter: {
      filter: {
        fieldName: "pagePath",
        stringFilter: { value: pathname, matchType: "EXACT" },
      },
    },
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });

  // Fallback to CONTAINS filter if exact match yields nothing
  if (!response?.rows?.length) {
    console.warn(`⚠️ No GA data for exact path "${pathname}", retrying with CONTAINS`);
    response = await runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: startStr, endDate: todayStr }],
      dimensions: [{ name: "date" }, { name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "totalUsers" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: { value: pathname, matchType: "CONTAINS" },
        },
      },
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });
  }

  if (!response?.rows?.length) {
    console.log(`📭 No GA data even after fallback for: ${pathname}`);
    return { totalViews: 0, totalUsers: 0, daily: [] };
  }

  /** Aggregate by date */
  const dailyData = {};
  for (const row of response.rows) {
    const date = row.dimensionValues?.[0]?.value || "unknown";
    const views = Number(row.metricValues?.[0]?.value || 0);
    const users = Number(row.metricValues?.[1]?.value || 0);
    if (!dailyData[date]) dailyData[date] = { views: 0, users: 0 };
    dailyData[date].views += views;
    dailyData[date].users += users;
  }

  /** Fill missing days */
  const filledDaily = [];
  const start = new Date(startStr);
  const end = new Date(todayStr);

  while (start <= end) {
    const dateStr = start.toISOString().split("T")[0].replace(/-/g, "");
    filledDaily.push({
      date: dateStr,
      views: dailyData[dateStr]?.views || 0,
      users: dailyData[dateStr]?.users || 0,
    });
    start.setDate(start.getDate() + 1);
  }

  const totalViews = filledDaily.reduce((sum, d) => sum + d.views, 0);
  const totalUsers = filledDaily.reduce((sum, d) => sum + d.users, 0);

  console.log(`📊 GA data for "${pathname}" (${interval}):`, {
    totalViews,
    totalUsers,
    filledDays: filledDaily.length,
  });

  return { totalViews, totalUsers, daily: filledDaily };
}