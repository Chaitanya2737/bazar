"use client";

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";

const Product = () => {
  const { userAuth, previewData } = useSelector((state) => ({
    userAuth: state.userAuth,
    previewData: state.previewData?.userPreview?.data,
  }));

  const phone = useMemo(() => previewData?.mobileNumber, [previewData]);

  const id = useMemo(
    () => previewData?._id || userAuth?._id,
    [previewData, userAuth]
  );

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!id) return;

    const fetchProducts = async () => {
      try {
        const response = await axios.post("/api/user/product/preview", { id });

        if (response.data?.success) {
          setProducts(response.data.products || []);
        } else {
          // Backend responded with success: false
          toast.error(response.data.message || "Something went wrong.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);

        if (error.response) {
          toast.error(error.response.data?.message || "Server error occurred.");
        } else if (error.request) {
          // Request made but no response received
          toast.error("No response from server. Please check your connection.");
        } else {
          // Something else happened
          toast.error("Unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg animate-pulse">
        Loading your products...
      </div>
    );
  }

const handleWhatsAppClick = (product) => {
  const message = `
नमस्कार 🙏, मला आपल्या उत्पादनाबद्दल माहिती हवी आहे:
कृपया अधिक माहिती देऊ शकाल का?
  `.trim();
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${phone[0]}?text=${encodedMessage}`;
  window.open(whatsappURL, "_blank");
};


  return (
    <div className="p-6 mx-0 md:mx-15 ">
      {products.length >= 0 ? (
        <h1 className="text-3xl sm:text-4xl font-bold font-semibold mb-6 text-center my-3">
          Product
        </h1>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className=" bg-white text-black dark:bg-gray-800 dark:text-white   rounded-xl shadow-md p-4 hover:shadow-lg transition"
          >
            <div className="relative w-full h-48 mb-3 rounded-md overflow-hidden">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-lg font-bold my-2">{product.title}</h2>
            <p className="text-sm text-black dark:text-white/80 my-2 line-clamp-2">
              {product.description}
            </p>
            <Button
              className={"w-full"}
              onClick={() => handleWhatsAppClick(product)}
            >
              View Details
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
