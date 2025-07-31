"use client";

import { use, useMemo, useState } from "react";
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
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

const VideoDialog = () => {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const routeId = params?.id;

  const user = useSelector((state) => state.userAuth, shallowEqual);
  const userdata = useSelector((state) => state.userdata, shallowEqual);

  const id = useMemo(() => {
    return userdata?.userData?._id || routeId;
  }, [user, userdata]);
  if (!id) {
    console.error("User ID is not defined");
    return null;
  }

  const handleAddVideo = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/user/addvideo", { link, id });
      const data = response.data;
      console.log(data);
      setLink("");
    } catch (error) {
      console.error("Error saving video link:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 ">
      <h1 className="text-2xl font-semibold ">Add Video Link</h1>

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
              disabled={!link || loading}
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoDialog;
