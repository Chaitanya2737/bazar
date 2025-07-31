"use client";

import React, { useState } from "react";
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
import { toast } from "sonner";

const UserProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    thumbnail: null,
  });

  const [open, setOpen] = useState(false);

  const selector = useSelector((state) => state.userAuth);
  const user = useSelector((state) => state.userdata?.userData);

  const id = user?._id || selector?._id;
  const businessName = user?.businessName || "default-business";
  const isLoggedIn = useSelector((state) => state.userAuth.isAuthenticated);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("Image size should not exceed 5MB.");
      return;
    }

    setProduct((prev) => ({ ...prev, thumbnail: file }));
  };

  const handleSubmit = async () => {
    if (!product.title || !product.thumbnail) {
      toast.error("Title and image are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("thumbnail", product.thumbnail);
    formData.append("userId", id);
    formData.append("businessName", businessName);

    try {
      if (!isLoggedIn) {
        toast.error("You must be logged in to upload a product.");
        return;
      }

      const res = await axios.post("/api/user/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { success, message } = res.data;

      if (!success) {
        toast.error(message || "Upload failed.");
      } else {
        toast.success("Product uploaded successfully!");
        setProduct({ title: "", description: "", thumbnail: null });
        setOpen(false);
      }
    } catch (err) {
      console.error("Upload error:", err);

      if (err.response) {
        toast.error(err.response.data?.message || "Server error occurred.");
      } else if (err.request) {
        toast.error("No response from server.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm font-medium">
          + Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Upload New Product
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              type="text"
              name="title"
              placeholder="Product Title"
              value={product.title}
              onChange={handleOnChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              type="text"
              name="description"
              placeholder="Product Description"
              value={product.description}
              onChange={handleOnChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} className="w-full">
            Submit Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProduct;
