"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { shallowEqual, useSelector } from "react-redux";
import { Loader2, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const VideoDialog = () => {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingVideos, setExistingVideos] = useState([]);
  const [deletingIndex, setDeletingIndex] = useState(null);

  const params = useParams();
  const routeId = params?.id;

  const userdata = useSelector((state) => state.userdata, shallowEqual);
  const id = useMemo(
    () => userdata?.userData?._id || routeId,
    [userdata, routeId]
  );

  useEffect(() => {
    if (userdata?.userData?.videoUrl) {
      setExistingVideos(userdata.userData.videoUrl);
    }
  }, [userdata]);

  // Convert YouTube link to embed URL
  const toEmbedUrl = (url) => {
    try {
      if (!url) return "";

      if (url.includes("/shorts/")) {
        const parts = url.split("/shorts/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${parts}`;
      }

      if (url.includes("youtu.be/")) {
        const parts = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${parts}`;
      }

      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;

      return url;
    } catch {
      return url;
    }
  };

  // Add video
  const handleAddVideo = async () => {
    const trimmedLink = link.trim();
    if (!trimmedLink) {
      toast.error("Please enter a valid YouTube link");
      return;
    }

    const prevVideos = [...existingVideos];
    setExistingVideos((prev) => [...prev, trimmedLink]); // Optimistic UI
    setLink("");

    try {
      setLoading(true);
      await axios.post("/api/user/addvideo", { link: trimmedLink, id });
      toast.success("Video added successfully!");
    } catch (error) {
      console.error("Error saving video link:", error);
      setExistingVideos(prevVideos); // revert UI
      toast.error("Failed to add video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete video
  const handleDeleteVideo = async (videoLink, index) => {
    const prevVideos = [...existingVideos];
    setExistingVideos((prev) => prev.filter((item) => item !== videoLink)); // Optimistic UI

    try {
      setDeletingIndex(index);
      await axios.delete("/api/user/addvideo", {
        data: { id, link: videoLink },
      });
      toast.success("Video deleted successfully!");
    } catch (error) {
      console.error("Error deleting video link:", error);
      setExistingVideos(prevVideos); // revert UI
      toast.error("Failed to delete video. Please try again.");
    } finally {
      setDeletingIndex(null);
    }
  };

  if (!id) {
    console.error("User ID is not defined");
    return null;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Add Video Link</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-dashed border-gray-400">
            + Add Video Link
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Paste YouTube Video Link
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-3">
            <Input
              type="url"
              placeholder="https://youtube.com/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>

          <DialogFooter>
            <Button
              onClick={handleAddVideo}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Saving...
                </div>
              ) : (
                "Save Link"
              )}
            </Button>
          </DialogFooter>

          {existingVideos.length > 0 && (
            <div className="mt-4 max-h-96 overflow-y-auto space-y-4">
              {existingVideos.map((item, index) => (
                <div
                  key={item} // use link as key for safety
                  className="relative w-full aspect-video rounded-xl shadow-lg overflow-hidden"
                >
                  <iframe
                    className="w-full h-full"
                    src={toEmbedUrl(item)}
                    title={`YouTube Video ${index + 1}`}
                    frameBorder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>

                  <button
                    onClick={() => handleDeleteVideo(item, index)}
                    disabled={deletingIndex === index}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 flex items-center justify-center"
                  >
                    {deletingIndex === index ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoDialog;
