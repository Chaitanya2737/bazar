"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { getUserDataApi } from "@/redux/slice/user/serviceApi";

// Simple debounce
const debounce = (fn, wait) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

const UserProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    thumbnail: null,
  });
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const dispatch = useDispatch();

  // Redux
  const user = useSelector((s) => s.userdata?.userData || s.userAuth);
  const id = user?._id;
  const businessName = user?.businessName || "My Business";

  // Fetch products
  const fetchProducts = async () => {
    if (!id) {
      toast.error("User ID not found. Please log in.");
      return;
    }

    console.log("Fetching products for user ID:", id);
    setLoading(true);
    try {
      const { data } = await axios.post("/api/user/product/preview", { id });

      console.log(data);
      if (data.success) {
        setProducts(data.products || []);
        setExpandedDescriptions({});
      } else {
        toast.error(data?.message || "Failed to fetch products.");
      }
    } catch (err) {
      handleApiError(err, "Error fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [id]);

  // Cleanup preview blob
  useEffect(() => {
    if (!product.thumbnail) return;
    const url = URL.createObjectURL(product.thumbnail);
    return () => URL.revokeObjectURL(url);
  }, [product.thumbnail]);

  const handleApiError = (error, fallback) => {
    if (error?.response) {
      toast.error(error.response.data?.message || fallback);
    } else if (error?.request) {
      toast.error("Unable to connect to the server. Please try again.");
    } else {
      toast.error(fallback);
    }
    console.error(error);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = useMemo(
    () =>
      debounce((e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
          toast.error("Please upload a valid image (PNG/JPEG).");
          return;
        }
        const MAX = 5 * 1024 * 1024;
        if (file.size > MAX) {
          toast.error("Image size must not exceed 5MB.");
          return;
        }
        setProduct((p) => ({ ...p, thumbnail: file }));
      }, 250),
    []
  );

  const handleSubmit = async () => {
    if (!product.title || !product.thumbnail) {
      toast.error("Please provide both a title and an image.");
      return;
    }
    setIsSubmitting(true);
    const form = new FormData();
    form.append("title", product.title);
    form.append("description", product.description);
    form.append("thumbnail", product.thumbnail);
    form.append("userId", id);
    form.append("businessName", businessName);

    try {
      const { data } = await axios.post("/api/user/product", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data?.success) {
        toast.success("Product uploaded successfully!");
        setProduct({ title: "", description: "", thumbnail: null });
        setOpen(false);
        setProducts((prev) => [data.product, ...prev]); // prepend new product
        console.log(products);
      } else {
        toast.error(data?.message || "Failed to upload product.");
      }
    } catch (err) {
      handleApiError(err, "Failed to upload product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE product
  const handleDelete = async (pid) => {
    try {
      const { data } = await axios.delete(`/api/user/product/delete`, {
        data: { pid }, // 👈 body must go inside "data"
      });

      if (data?.success) {
        toast.success("Product deleted successfully!");
        setProducts((prev) => prev.filter((p) => p._id !== pid));
      } else {
        toast.error(data?.message || "Failed to delete product.");
      }
    } catch (err) {
      handleApiError(err, "Error deleting product.");
    }
  };

  // Toggle description
  const toggleDescription = (pid) => {
    setExpandedDescriptions((prev) => ({ ...prev, [pid]: !prev[pid] }));
  };

  const words = (str) =>
    typeof str === "string" ? str.trim().split(/\s+/).filter(Boolean) : [];

  const truncateTo20Words = (str) => {
    const w = words(str);
    if (w.length <= 20) return str || "";
    return w.slice(0, 20).join(" ") + "…";
  };

  const carouselItems = useMemo(
    () =>
      products.map((p) => {
        const pid = p._id;
        const desc = p.description || "";
        const isLong = words(desc).length > 50;
        const isOpen = !!expandedDescriptions[pid];

        return (
          <CarouselItem
            key={pid}
            className="basis-full sm:basis-1/2 lg:basis-1/3"
          >
            <Card className="p-4 h-full">
              <CardContent className="flex flex-col h-full">
                {/* Image + Delete Button */}
                <div className="relative w-full h-48 rounded-xl overflow-hidden mb-3 bg-gray-100">
                  <Image
                    src={p.thumbnail}
                    alt={p.title || "Product Image"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain"
                    unoptimized={false}
                  />

                  {/* Delete Button (Top Right) */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full p-2"
                    onClick={() => handleDelete(pid)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-center">{p.title}</h3>

                {/* Description */}
                <p
                  id={`desc-${pid}`}
                  className="mt-2 text-gray-600 text-center text-sm"
                >
                  {isLong && !isOpen
                    ? truncateTo20Words(desc)
                    : desc || "No description available"}
                </p>

                {isLong && (
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-1 self-center"
                    onClick={() => toggleDescription(pid)}
                    aria-expanded={isOpen}
                    aria-controls={`desc-${pid}`}
                  >
                    {isOpen ? "Show Less" : "Show More"}
                  </Button>
                )}

                <div className="mt-auto" />
              </CardContent>
            </Card>
          </CarouselItem>
        );
      }),
    [products, expandedDescriptions]
  );

  return (
    <div className="container mx-auto p-4">
      {/* Upload Product Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex justify-center mb-6">
          <DialogTrigger asChild>
            <Button variant="outline" className="text-sm font-medium">
              + Add Product
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Upload New Product
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Thumbnail Upload */}
            <div>
              <label
                htmlFor="thumbnail"
                className="block text-sm font-medium mb-1"
              >
                Thumbnail
              </label>
              <Input
                id="thumbnail"
                key={product.thumbnail ? product.thumbnail.name : "file-input"}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full cursor-pointer"
              />
              {product.thumbnail && (
                <img
                  src={URL.createObjectURL(product.thumbnail)}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md mt-2"
                />
              )}
            </div>

            {/* Title Input */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title
              </label>
              <Input
                id="title"
                type="text"
                name="title"
                placeholder="Product Title"
                value={product.title}
                onChange={handleInputChange}
              />
            </div>

            {/* Description Input */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Product Description"
                value={product.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Submitting..." : "Submit Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Listing */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">My Products</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products uploaded yet.</p>
        ) : (
          <Carousel className="relative">
            <CarouselContent>{carouselItems}</CarouselContent>
            <CarouselPrevious aria-label="Previous product" />
            <CarouselNext aria-label="Next product" />
          </Carousel>
        )}
      </div>
    </div>
  );
};

export default UserProduct;
