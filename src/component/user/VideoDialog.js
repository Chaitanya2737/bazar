// VideoDialog.tsx

"use client";

import { useState } from "react";
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
import { useSelector } from "react-redux";

const VideoDialog = () => {
  const [link, setLink] = useState("");
  const selector = useSelector((state) => state.userAuth);

    const id = selector?.id;
    if (id === undefined) {
      console.error("User ID is not defined");
      return null; // or handle the error appropriately
    }

  const handleAddVideo = async () => {
    // Logic to handle adding the video link
    try {
      console.log("Video Link Added:", link);
      const response = await axios.post("/api/user/addvideo", { link , id });
      const data = await response.data;
      console.log(data);
      setLink(""); // Reset the input after adding
    } catch (error) {}
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add user link</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Paste Video Link</DialogTitle>
        </DialogHeader>

        <Input
          type="text"
          placeholder="Enter video link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <DialogFooter>
          <Button onClick={handleAddVideo}>Save Link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDialog;
