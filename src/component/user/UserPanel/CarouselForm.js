// CarouselForm.jsx
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

const CarouselForm = ({ carauselImages, storedUser, id, businessName, dispatch, handleUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files.length) return;
    const previews = [...files].map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handlefilesubmit = async (e) => {
    e.preventDefault();
    if (carauselImages.length >= 5) return toast.error("Max 5 images allowed");

    const files = e.target.picture.files;
    if (!files.length) return toast.error("Select at least one image");

    setUploading(true);
    try {
      const formData = new FormData();
      for (let file of files) {
        if (file.size > 1024 * 1024) return toast.error("File too large");
        formData.append("pictures", file);
      }
      await handleUpload(formData);
      setPreviewImages([]);
      e.target.reset();
    } catch (err) {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="mb-12">
      <h1 className="text-3xl font-bold mb-6">Add Carousel</h1>
      <form onSubmit={handlefilesubmit} className="space-y-6">
        <Label
          htmlFor="picture"
          className="w-full flex flex-col items-center border-2 border-dashed border-gray-300 p-6 rounded-lg cursor-pointer hover:border-blue-500"
        >
          <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M7 16V4m0 0l-4 4m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-sm">Click or drag files to upload</p>
          <Input id="picture" name="picture" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
        </Label>
        {previewImages.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {previewImages.map((src, idx) => (
              <Image key={idx} src={src} alt="preview" width={100} height={100} className="rounded shadow" />
            ))}
          </div>
        )}
        <Button type="submit" disabled={uploading} className="w-full">
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </form>
    </section>
  );
};

export default CarouselForm;
