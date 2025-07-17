import React from "react";

const Video = ({ Video }) => {
  if (!Array.isArray(Video) || Video.length === 0) return null;

  // Extract YouTube video ID from a given URL
  const getYouTubeID = (url) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === "youtu.be") {
        return parsedUrl.pathname.slice(1);
      }
      if (parsedUrl.hostname.includes("youtube.com")) {
        return parsedUrl.searchParams.get("v");
      }
      return null;
    } catch {
      return null;
    }
  };

  return (
    <div className="grid gap-6 mt-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
      {Video.map((url, index) => {
        const videoId = getYouTubeID(url);
        if (!videoId) return null;

        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;

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
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      })}
    </div>
  );
};

export default Video;
