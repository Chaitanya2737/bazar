"use client";

import React, { useEffect, useState, useCallback , useMemo } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserCarouselImage,
  getUserDataApi,
  updateUsercarousel,
} from "@/redux/slice/user/serviceApi";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Trash2 } from "lucide-react";
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
import ThemeToggle from "@/component/themeToggle/themeToggle";
import { Switch } from "@/components/ui/switch";

// Memoized ConfirmModal to prevent unnecessary re-renders
const ConfirmModal = React.memo(({ open, message, onConfirm, onCancel }) => {
  return (
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
          <Button
            variant="ghost"
            onClick={onCancel}
            className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="rounded-lg bg-red-600 hover:bg-red-700 shadow-md transition-all duration-200"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

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
  const isUserLoaded = useSelector((state) => !!state.userdata?.userData?._id);

  useEffect(() => {
    if (!isUserLoaded || storedUser?._id !== id) {
      dispatch(getUserDataApi(id));
    }
  }, [dispatch, id, isUserLoaded, storedUser]);

  const {
    businessName,
    mobileNumber = [],
    businessIcon,
    socialMediaLinks = [],
    businessLocation,
    bio,
    carauselImages = [],
  } = storedUser || {};

  const handleFileChange = useCallback((e) => {
    const files = e.target.files || e.dataTransfer?.files;
    if (!files || files.length === 0) return;
    const previews = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  }, []);

  const handlefilesubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (carauselImages.length >= 5) {
        toast.error("You can only upload a maximum of 5 images.");
        return;
      }

      const files = e.target.picture.files;
      if (!files || files.length === 0) {
        toast.error("Please select at least one image to upload.");
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          if (files[i].size >  1024 * 1024 *100) {
            toast.error(`File "${files[i].name}" is larger than 1 MB.`);
            setUploading(false);
            return;
          }
          formData.append("pictures", files[i]);
        }

        const userId = storedUser?._id || id;
        const res = await updateUsercarousel(
          userId,
          businessName || "defaultBusiness",
          formData
        );

        if (res?.success) {
          toast.success("Files uploaded successfully!");
          dispatch(getUserDataApi(userId));
          e.target.reset();
          setPreviewImages([]);
        } else {
          toast.error("Files not uploaded successfully. Please try again.");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Error uploading files. Please check your connection.");
      } finally {
        setUploading(false);
      }
    },
    [carauselImages.length, storedUser?._id, id, businessName, dispatch]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      setIsDragging(false);

      if (carauselImages.length >= 5) {
        toast.error("You can only upload a maximum of 5 images.");
        return;
      }

      const files = e.dataTransfer.files;
      if (!files || files.length === 0) {
        toast.error("Please drop at least one image to upload.");
        return;
      }

      setPreviewImages(
        Array.from(files).map((file) => URL.createObjectURL(file))
      );
      setUploading(true);
      try {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          if (files[i].size > 1024 * 1024) {
            toast.error(`File "${files[i].name}" is larger than 1 MB.`);
            setUploading(false);
            return;
          }
          formData.append("pictures", files[i]);
        }

        const userId = storedUser?._id || id;
        const res = await updateUsercarousel(
          userId,
          businessName || "defaultBusiness",
          formData
        );

        if (res?.success) {
          toast.success("Files uploaded successfully!");
          dispatch(getUserDataApi(userId));
          setPreviewImages([]);
        } else {
          toast.error("Files not uploaded successfully. Please try again.");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Error uploading files. Please check your connection.");
      } finally {
        setUploading(false);
      }
    },
    [carauselImages.length, storedUser?._id, id, businessName, dispatch]
  );

  const openDeleteConfirm = useCallback((imageUrl) => {
    setImageToDelete(imageUrl);
    setConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!imageToDelete) return;
    try {
      const userId = storedUser?._id;
      const res = await deleteUserCarouselImage(
        userId,
        businessName,
        imageToDelete
      );

      if (res?.success) {
        toast.success("Image deleted successfully!");
        dispatch(updatedUsercarousel(res.user));
      } else {
        toast.error("Failed to delete image. Please try again.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Error deleting image. Please check your connection.");
    } finally {
      setConfirmOpen(false);
      setImageToDelete(null);
    }
  }, [imageToDelete, storedUser?._id, businessName, dispatch]);

  const handleCancelDelete = useCallback(() => {
    setConfirmOpen(false);
    setImageToDelete(null);
  }, []);

  // Cleanup preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  return (
    <main className="min-h-screen font-sans text-black dark:bg-gray-900 dark:text-white transition-all duration-300 bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2720%27 height=%2720%27 viewBox=%270 0 20 20%27%3E%3Cg opacity=%270.05%27%3E%3Ccircle cx=%2710%27 cy=%2710%27 r=%271%27 fill=%27%23a1a1aa%27/%3E%3C/g%3E%3C/svg%3E%27')] dark:bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2720%27 height=%2720%27 viewBox=%270 0 20 20%27%3E%3Cg opacity=%270.1%27%3E%3Ccircle cx=%2710%27 cy=%2710%27 r=%271%27 fill=%27%23e2e8f0%27/%3E%3C/g%3E%3C/svg%3E%27')]">
     
     {/* carousel section  */}
     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>

        {isUserLoaded && storedUser?._id === id ? (
          <>
            {/* User Info Card */}
            <section
              className="bg-gradient-to-tr from-[#edf2f7] via-[#cbd5e1] to-[#e0e7ff] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#334155] rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 grid md:grid-cols-2 gap-6 sm:gap-8 animate-fade-in"
              aria-label="User business information"
            >
              <div className="flex justify-center items-center">
                {businessIcon ? (
                  <Image
                    src={businessIcon}
                    alt={`${businessName} logo`}
                    width={160}
                    height={160}
                    priority
                    className="rounded-full shadow-lg border-4 border-white dark:border-slate-700 transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <Skeleton className="w-40 h-40 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
                )}
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                  {businessName || (
                    <Skeleton className="w-48 h-10 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                  )}
                </h2>
                {bio && (
                  <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                    {bio}
                  </p>
                )}
                <div className="flex items-center text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 space-x-3">
                  <Phone className="w-5 h-5 text-indigo-500 dark:text-indigo-300" />
                  {mobileNumber.length > 0 ? (
                    <span>
                      {mobileNumber.map((number, index) => (
                        <span key={index}>
                          {number}
                          {index < mobileNumber.length - 1 && " | "}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <Skeleton className="w-32 h-4 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                  )}
                </div>
                <div className="flex items-center text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 space-x-3">
                  <MapPin className="w-5 h-5 text-pink-500 dark:text-pink-300" />
                  <span>
                    {businessLocation || (
                      <Skeleton className="w-32 h-4 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                    )}
                  </span>
                </div>
                <div className="flex gap-4 sm:gap-6 pt-4 flex-wrap">
                  {socialMediaLinks.length > 0 ? (
                    socialMediaLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-300 font-semibold hover:underline hover:text-indigo-800 dark:hover:text-indigo-100 transition-all duration-200"
                      >
                        {link.platform}
                      </a>
                    ))
                  ) : (
                    <>
                      <Skeleton className="w-24 h-5 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                      <Skeleton className="w-24 h-5 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                    </>
                  )}
                </div>
              </div>
            </section>

            <div className=" border-gray-200   dark:border-gray-700 my-8 sm:my-10" />

            {carauselImages?.length < 5 && (
              <>
                <div className="relative bg-gradient-to-r from-[#D1FAE5] via-[#a5d4f1] to-[#749d8d] text-gray-900 py-8 px-6 rounded-xl shadow-2xl overflow-hidden mb-10">
                  <div className="max-w-5xl mx-auto text-center z-10 relative">
                    <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">
                      Boost Your Brand with Stunning Carousel Images
                    </h1>
                    <p className="mt-4 text-lg md:text-lg font-medium text-blue-100">
                      Easily upload, manage, and showcase your business through
                      eye-catching visuals.
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-black/10 z-0 blur-sm rounded-xl" />
                </div>

                <section
                  aria-label="Upload carousel images"
                  className="max-w-xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-slate-700 transition-all duration-300 animate-fade-in"
                >
                  <form
                    onSubmit={handlefilesubmit}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`space-y-6 ${
                      isDragging
                        ? "border-2 border-dashed border-blue-500 bg-blue-50 dark:bg-blue-900/50"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <Label
                        htmlFor="picture"
                        className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 sm:p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200"
                      >
                        <svg
                          className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 16V4m0 0l-4 4m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
                          />
                        </svg>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Click or drag files to upload
                        </p>
                        <Input
                          id="picture"
                          name="picture"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                          disabled={uploading || carauselImages.length >= 5}
                          aria-describedby="upload-info"
                        />
                      </Label>
                      <span
                        id="upload-info"
                        className="text-xs text-gray-500 dark:text-gray-400 mt-2"
                      >
                        {carauselImages.length} / 5 images uploaded
                      </span>
                    </div>
                    {previewImages.length > 0 && (
                      <div className="flex flex-wrap gap-4 justify-center ">
                        {previewImages.map((src, index) => (
                          <Image
                            key={index}
                            src={src}
                            alt={`Preview ${index + 1}`}
                            width={100}
                            height={100}
                            className="w-24 h-24 object-cover rounded-lg shadow-md transition-all duration-300 hover:scale-105"
                          />
                        ))}
                      </div>
                    )}
                    <Button
                      type="submit"
                      disabled={uploading || carauselImages.length >= 5}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-lg shadow-md transition-all duration-300"
                    >
                      {uploading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Uploading...
                        </span>
                      ) : (
                        "Upload"
                      )}
                    </Button>
                  </form>
                </section>
              </>
            )}

            <div className="border-y-2 border-gray-200 dark:border-gray-700 my-8 sm:my-10" />

            <div>
              {/* Toggle Switch */}
              <div className="flex items-center justify-between mb-6">
                <label
                  htmlFor="carousel-toggle"
                  className="text-lg font-semibold"
                />
                Enable Carousel View
                <Switch
                  id="carousel-toggle"
                  checked={isCarousel}
                  onCheckedChange={setIsCarousel}
                  className="data-[state=checked]:bg-blue-600 "
                />
              </div>

              {/* Carousel Section */}
              <section
                aria-label="Carousel images gallery"
                className="my-10 min-h-[300px] animate-fade-in"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-semibold text-center md:text-left tracking-tight">
                    Existing Carousel Images
                  </h2>
                </div>

                {isCarousel && carauselImages.length > 0 ? (
                  <div className="flex overflow-x-auto space-x-6 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200 dark:scrollbar-track-gray-700">
                    {carauselImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl snap-start min-w-[250px]"
                      >
                        <Image
                          src={image}
                          alt={`Carousel Image ${index + 1}`}
                          width={300}
                          height={200}
                          className="w-full h-[200px] object-cover rounded-xl"
                        />
                        <Button
                          onClick={() => openDeleteConfirm(image)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-all duration-200"
                          aria-label={`Delete image ${index + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : isCarousel ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
                    No carousel images uploaded yet.
                  </p>
                ) : null}
              </section>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-48">
            <Skeleton className="w-64 h-10 rounded-lg bg-gray-300 dark:bg-gray-700 animate-pulse" />
          </div>
        )}
      </div>

       


      {/* Confirm Delete Modal */}

      <ConfirmModal
        open={confirmOpen}
        message="Are you sure you want to delete this image?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </main>
  );
}

// Add custom animation and scrollbar styles
const style = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
  .scrollbar-thin {
    scrollbar-width: thin;
  }
  .scrollbar-thumb-blue-500::-webkit-scrollbar-thumb {
    background-color: #3b82f6;
    border-radius: 20px;
  }
  .scrollbar-track-gray-200::-webkit-scrollbar-track {
    background-color: #e5e7eb;
  }
  .dark .scrollbar-track-gray-700::-webkit-scrollbar-track {
    background-color: #374151;
  }
`;
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = style;
  document.head.appendChild(styleSheet);
}
