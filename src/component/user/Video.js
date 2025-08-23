import React from "react";

const Video = ({ Video }) => {
  if (!Array.isArray(Video) || Video.length === 0) return null;

  // Convert any YouTube URL to embed URL
  const toEmbedUrl = (url) => {
    try {
      if (!url) return null;

      // Shorts URL
      if (url.includes("/shorts/")) {
        const parts = url.split("/shorts/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${parts}?mute=1`;
      }

      // Shortened youtu.be URL
      if (url.includes("youtu.be/")) {
        const parts = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${parts}?mute=1`;
      }

      // Normal watch URL
      const parsedUrl = new URL(url);
      const videoId = parsedUrl.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}?mute=1`;

      // fallback
      return url;
    } catch {
      return url;
    }
  };

  return (
    <div className="mt-6 max-h-[80vh] overflow-y-auto">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Video.map((url, index) => {
          const embedUrl = toEmbedUrl(url);
          if (!embedUrl) return null;

          return (
            <div
              key={index}
              className="w-full aspect-video rounded-xl shadow-lg overflow-hidden"
            >
              <iframe
                className="w-full h-full"
                src={embedUrl}
                title={`YouTube Video ${index + 1}`}
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Video;
