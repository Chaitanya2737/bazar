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

const propertyId = process.env.GA_PROPERTY_ID || "506284738"; // fallback

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
export async function getPageViews(pathName, startDate = "2025-09-01") { // Made startDate optional/dynamic
  const [response] = await runReport({
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
      (total, row) => total + Number(row.metricValues[0].value || 0),
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
export async function getAnalyticsData(
  pathName,
  interval = "7d",
  filterType = "CONTAINS",
  debug = false,
  noFilter = false
) {
  const propertyId = "506284738";

  // Determine date range
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD

  const start = new Date();
  const daysBack = interval === "30d" ? 30 : 7;
  start.setDate(today.getDate() - daysBack);
  const startStr = start.toISOString().slice(0, 10);

  // Normalize path
  let normalizedPath = pathName.startsWith("/")
    ? pathName.replace(/\/$/, "")
    : `/${pathName.replace(/\/$/, "")}`;

  if (filterType === "BEGINS_WITH") {
    normalizedPath = normalizedPath.replace(/\/$/, "") + "/";
  }

  // Prepare GA4 request
  const request = {
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: startStr, endDate: todayStr }],
    dimensions: [{ name: "date" }, { name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  };

  if (!noFilter) {
    request.dimensionFilter = {
      filter: {
        fieldName: "pagePath",
        stringFilter: { value: normalizedPath, matchType: filterType },
      },
    };
  }

  try {
    const response = await client.runReport(request);

    // Debug logs
    if (debug) {
      console.log(`GA4 Debug for ${normalizedPath} (${interval}):`);
      console.log(`- Date range: ${startStr} to ${todayStr}`);
      console.log(`- Raw rows count: ${response.rows?.length || 0}`);
      console.log(
        "- Sample rows:",
        response.rows?.slice(0, 3).map((row) => ({
          date: row.dimensionValues[0].value,
          path: row.dimensionValues[1].value,
          views: row.metricValues[0].value,
          users: row.metricValues[1].value,
        })) || "None"
      );
      console.log(
        "- Totals in response:",
        {
          totalViews: response.totals?.[0]?.values?.[0]?.value || 0,
          totalUsers: response.totals?.[0]?.values?.[1]?.value || 0,
        }
      );
    }

    // Aggregate rows by date
    const dailyAggregated = response.rows?.reduce((acc, row) => {
      const date = row.dimensionValues[0].value;
      const views = Number(row.metricValues[0].value);
      const users = Number(row.metricValues[1].value);
      if (!acc[date]) acc[date] = { views: 0, users: 0 };
      acc[date].views += views;
      acc[date].users += users;
      return acc;
    }, {}) || {};

    const totalViews = Object.values(dailyAggregated).reduce(
      (sum, d) => sum + d.views,
      0
    );
    const totalUsers = Object.values(dailyAggregated).reduce(
      (sum, d) => sum + d.users,
      0
    );

    // Fill missing dates
    const filledDaily = [];
    const current = new Date(start);
    while (current <= today) {
      const dateStr = current.toISOString().slice(0, 10);
      const day = dailyAggregated[dateStr] || { views: 0, users: 0 };
      filledDaily.push({
        date: dateStr.replace(/-/g, ""), // YYYYMMDD for charts
        views: day.views,
        users: day.users,
      });
      current.setDate(current.getDate() + 1);
    }

    if (debug) {
      console.log("- Aggregated totals:", { totalViews, totalUsers });
      console.log("- Filled daily sample:", filledDaily.slice(0, 3));
    }

    return { totalViews, totalUsers, daily: filledDaily };
  } catch (error) {
    console.error("Google Analytics fetch failed:", error);

    // Fallback: fill with zeros
    const filledDaily = [];
    const fallbackStart = new Date(start);
    while (fallbackStart <= today) {
      const dateStr = fallbackStart.toISOString().slice(0, 10).replace(/-/g, "");
      filledDaily.push({ date: dateStr, views: 0, users: 0 });
      fallbackStart.setDate(fallbackStart.getDate() + 1);
    }

    return { totalViews: 0, totalUsers: 0, daily: filledDaily };
  }
}
