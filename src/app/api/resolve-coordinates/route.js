import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response(JSON.stringify({ error: "Missing URL" }), {
      status: 400,
    });
  }

  try {
    const response = await axios.get(url);
    const finalUrl = response.request.res.responseUrl || url; // actual final URL after redirects

    const match = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {

        console.log(match);
      return new Response(
        JSON.stringify({
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2]),
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Coordinates not found in URL" }),
      { status: 400 }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to resolve URL" }), {
      status: 400,
    });
  }
}
