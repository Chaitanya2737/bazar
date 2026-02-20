import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ArrowDownFromLine, ArrowUpFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";

const SuggestionProduct = ({ categoryId , userId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(2);
  const [selectedProducts, setSelectedProducts] = useState([]); 
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1024) setVisibleCount(5);
      else if (window.innerWidth >= 768) setVisibleCount(4);
      else setVisibleCount(2);
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        "/api/user/suggestionproduct/viewproduct",
        { category_Id: categoryId },
      );

      if (response.data?.products?.length) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
        setError("No products found for this category.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) fetchProduct();
  }, [categoryId]);


  const handleSelect = (product) => {
    setSelectedProducts((prev) => {
      const alreadySelected = prev.find((item) => item._id === product._id);

      let updated;

      if (alreadySelected) {
        updated = prev.filter((item) => item._id !== product._id);
      } else {
        updated = [...prev, product];
      }

      console.log("Selected Items:", updated);
      return updated;
    });
  };

  const handleSubmitSelected = async () => {
    if (selectedProducts.length === 0) return;

    try {
      setSubmitting(true);

      const productIds = selectedProducts.map((item) => item._id);

      const response = await axios.post("/api/user/suggestionproduct/userchooseproduct", {
        selectedProducts: productIds,
        userId
      });

      console.log("Backend Response:", response.data);

      // Optional: Clear selection after success
      setSelectedProducts([]);
    } catch (error) {
      console.error("Submit Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-lg font-medium text-gray-500 animate-pulse">
          Loading products...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </div>
    );
  }

  const isSelected = (id) => selectedProducts.find((item) => item._id === id);

  return (
    <div className="w-full max-w-8xl mx-auto px-2 md:px-0 py-0 ">
      <div className="flex items-center justify-between mb-6 my-3">
        <h2 className="text-2xl font-bold">
          Choose product ({selectedProducts.length})
        </h2>

        {products.length > visibleCount && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-4 bg-[oklch(.97 0 0)] hover:bg-gray-200 rounded-full shadow-md transition"
          >
            {expanded ? (
              <ArrowUpFromLine className="w-5 h-5" />
            ) : (
              <ArrowDownFromLine className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Visible Products */}
      
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 py-0 ">
        {products.slice(0, visibleCount).map((product) => (
          <Card
            key={product._id}
            onClick={() => handleSelect(product)}
            className={`cursor-pointer transition-all duration-300 p-1
              ${
                isSelected(product._id)
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : "hover:shadow-lg shadow-md"
              }
            `}
          >
            <CardContent className="flex flex-col items-center gap-2 p-4">
              {product.images ? (
                <div className="relative w-22 h-22 md:w-32 md:h-32 mb-2">
                  <Image
                    src={product.images}
                    alt={product.title}
                    fill
                    priority
                    className="object-cover rounded-md"
                  />
                </div>
              ) : (
                <div className="w-22 h-22 md:w-32 md:h-32 bg-gray-200 rounded-md flex items-center justify-center mb-2">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}

              <span className="text-center font-semibold text-sm md:text-base">
                {product.title}
              </span>

              {product.description && (
                <p className="text-center text-xs md:text-sm text-gray-500 mt-1">
                  {product.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      

      {/* Expanded Section */}
      {products.length > visibleCount && (
        <div
          className={`overflow-hidden transition-[max-height] duration-500 ease-in-out mt-4 ${
            expanded ? "max-h-[2000px]" : "max-h-0"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.slice(visibleCount).map((product) => (
              <Card
                key={product._id}
                onClick={() => handleSelect(product)}
                className={`cursor-pointer transition-all duration-300
                  ${
                    isSelected(product._id)
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:shadow-lg shadow-md"
                  }
                `}
              >
                <CardContent className="flex flex-col items-center gap-2 p-4">
                  {product.images ? (
                    <div className="relative w-28 h-28 md:w-32 md:h-32 mb-2">
                      <Image
                        src={product.images}
                        alt={product.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="w-28 h-28 md:w-32 md:h-32 bg-gray-200 rounded-md flex items-center justify-center mb-2">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}

                  <span className="text-center font-semibold text-sm md:text-base">
                    {product.title}
                  </span>

                  {product.description && (
                    <p className="text-center text-xs md:text-sm text-gray-500 mt-1">
                      {product.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedProducts.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleSubmitSelected}
            disabled={submitting}
            className=" bg-neutral-700 text-white rounded-lg shadow-2xl transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : `Add to page`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SuggestionProduct;
