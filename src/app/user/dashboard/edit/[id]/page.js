"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserCarouselImage,
  getUserDataApi,
  updateUsercarousel,
} from "@/redux/slice/user/serviceApi";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updatedUsercarousel } from "@/redux/slice/user/getuserData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import ThemeToggle from "@/component/themeToggle/themeToggle";
import CarouselForm from "@/component/user/UserPanel/CarouselForm";
import VideoDialog from "@/component/user/UserPanel/VideoDialog";
import UserProduct from "@/component/user/UserPanel/UserProduct";

const ConfirmModal = React.memo(({ open, message, onConfirm, onCancel }) => (
  <Dialog open={open} onOpenChange={onCancel}>
    <DialogContent className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-6 transition-all duration-300">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Are you sure?
        </DialogTitle>
        <DialogDescription className="text-gray-600 dark:text-gray-300">
          {message}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex justify-end gap-4 mt-4">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
));
ConfirmModal.displayName = "ConfirmModal";

export default function EditUserPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [isCarousel, setIsCarousel] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  const storedUser = useSelector((state) => state.userdata?.userData);
  const isUserLoaded = useSelector((state) => !!storedUser?._id);

  useEffect(() => {
    if (!isUserLoaded || storedUser?._id !== id) {
      dispatch(getUserDataApi(id));
    }
  }, [dispatch, id, isUserLoaded, storedUser]);

  const { businessName, carauselImages = [] } = storedUser || {};

  console.log();

  const openDeleteConfirm = (imgUrl) => {
    setImageToDelete(imgUrl);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;
    try {
      const userId = storedUser?._id;
      const res = await deleteUserCarouselImage(
        userId,
        businessName,
        imageToDelete
      );

      if (res?.success) {
        toast.success("Deleted");
        dispatch(updatedUsercarousel(res.user));
      } else toast.error("Failed to delete");
    } catch (err) {
      toast.error("Error deleting");
    } finally {
      setConfirmOpen(false);
      setImageToDelete(null);
    }
  };

  return (
    <main className="min-h-screen font-sans dark:bg-gray-900 text-black dark:text-white transition-all bg-dot-light dark:bg-dot-dark">
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {/* Theme Toggle */}

        {/* Carousel Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 transition-all">
          {isUserLoaded && storedUser?._id === id ? (
            <>
              <CarouselForm
                carauselImages={carauselImages}
                storedUser={storedUser}
                id={id}
                businessName={businessName}
                dispatch={dispatch}
                handleUpload={async (formData) => {
                  const userId = storedUser?._id || id;
                  const res = await updateUsercarousel(
                    userId,
                    businessName || "defaultBusiness",
                    formData
                  );
                  if (res?.success) {
                    toast.success("Uploaded! ");
                    dispatch(getUserDataApi(userId));
                  } else {
                    toast.error("Failed to upload");
                  }
                }}
              />

              <div className="flex items-center justify-between mb-6 mt-8 border-t pt-6 border-gray-300 dark:border-gray-600">
                <label
                  htmlFor="carousel-toggle"
                  className="text-lg font-medium"
                >
                  Enable Carousel View
                </label>
                <Switch
                  id="carousel-toggle"
                  checked={isCarousel}
                  onCheckedChange={setIsCarousel}
                />
              </div>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Carousel Images</h2>
                {isCarousel && carauselImages.length ? (
                  <div className="flex overflow-x-auto gap-6 pb-2">
                    {carauselImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative min-w-[250px] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        <Image
                          src={img}
                          alt={`carousel-${idx}`}
                          width={300}
                          height={200}
                          className="object-cover transition-all hover:scale-105 duration-200"
                        />
                        <Button
                          onClick={() => openDeleteConfirm(img)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-1 rounded-full shadow"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No carousel images uploaded yet.
                  </p>
                )}
              </section>
            </>
          ) : (
            <div className="flex justify-center items-center h-48">
              <Skeleton className="w-64 h-10 rounded-lg" />
            </div>
          )}
        </div>

        {/* Video Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex flex-col items-center gap-6">
            <VideoDialog />
          </div>
        </div>

        {/* Product Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Add Products
          </h2>
          <div className="flex flex-col items-center gap-6">
            <UserProduct />
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        message="Are you sure you want to delete this image?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </main>
  );
}

// Background pattern
if (typeof document !== "undefined") {
  const style = `
    .bg-dot-light {
      background-image: radial-gradient(#a1a1aa 1px, transparent 1px);
      background-size: 20px 20px;
    }
    .dark .bg-dot-dark {
      background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
      background-size: 20px 20px;
    }
  `;
  const sheet = document.createElement("style");
  sheet.innerHTML = style;
  document.head.appendChild(sheet);
}
