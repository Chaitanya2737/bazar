"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Calendar,
  MapPin,
  Tag,
  Filter,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Loader from "@/component/loader/loader";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const DisplayOffer = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const router = useRouter();

  const fetchOffer = async () => {
    try {
      const response = await axios.get("/api/user/siteoffer/displayoffer");
      const offersData = response.data?.offers || [];
      setOffers(offersData);
      setFilteredOffers(offersData);

      const uniqueCategories = [
        ...new Set(
          offersData
            .map((offer) => offer.category)
            .filter((category) => category && category.trim() !== "")
        ),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchOffer();
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...offers];

    if (selectedCategory !== "all") {
      result = result.filter(
        (offer) =>
          offer.category &&
          offer.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (offer) =>
          offer.title?.toLowerCase().includes(term) ||
          offer.description?.toLowerCase().includes(term) ||
          offer.businessName?.toLowerCase().includes(term) ||
          offer.category?.toLowerCase().includes(term)
      );
    }

    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt || b.startDate || 0) -
            new Date(a.createdAt || a.startDate || 0)
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt || a.startDate || 0) -
            new Date(b.createdAt || b.startDate || 0)
        );
        break;
      case "az":
        result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "za":
        result.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
    }

    setFilteredOffers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [offers, searchTerm, sortBy, selectedCategory]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOffers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openUserSite = (e, userName) => {
    e.preventDefault();

    if (!userName) {
      toast.error("business name not found");
      return;
    }
    const filterUserName = userName
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[~!@#$%^&*()_+={}[\]|\\:;"'<>,.?/]/g, "")
      .replace(/-+/g, "-") // collapse multiple hyphens
      .toLowerCase();
    router.push(`/${filterUserName}`);
  };

  const openWhatsApp = (contact) => {
    if (!contact) return;

    // Remove non-digit characters
    let phone = contact.replace(/\D/g, "");

    // Ensure it has country code (assuming India)
    if (!phone.startsWith("91")) {
      phone = "91" + phone;
    }

    const message = "Hello, I'm interested in your offer!";
    const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <main className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader />
        <p className="text-gray-600 dark:text-gray-300 text-lg animate-pulse">
          Finding the best offers for you...
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Special Offers
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Discover exclusive deals from our customers
        </p>
      </header>

      {/* Filters */}
      <section className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 md:items-end">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <Input
              placeholder="Search offers by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Category Select */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-60 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 transition">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Select */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-40 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 focus:ring-2 focus:ring-blue-500 transition">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="za">Z-A</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters Button */}
          {(searchTerm ||
            selectedCategory !== "all" ||
            sortBy !== "newest") && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-2 md:mt-0 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Clear
            </Button>
          )}
        </div>
      </section>

      {/* Active Filters */}
      {(searchTerm || selectedCategory !== "all") && (
        <aside className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Active filters:
          </span>
          {searchTerm && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
            >
              Search: {searchTerm}
              <X
                size={14}
                className="cursor-pointer"
                onClick={() => setSearchTerm("")}
              />
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
            >
              Category: {selectedCategory}
              <X
                size={14}
                className="cursor-pointer"
                onClick={() => setSelectedCategory("all")}
              />
            </Badge>
          )}
        </aside>
      )}

      {/* Results Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {Math.min(filteredOffers.length, indexOfFirstItem + 1)}-
          {Math.min(filteredOffers.length, indexOfLastItem)} of{" "}
          {filteredOffers.length} offers
        </p>

        {totalPages > 1 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* Offers Grid */}
      <section>
        {currentItems.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <Tag className="h-12 w-12 text-gray-400 dark:text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {offers.length === 0 ? "No offers available" : "No matches found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {offers.length === 0
                ? "Check back later for new offers."
                : "Try adjusting your search or filter criteria."}
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <Button
                variant="outline"
                className="mt-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {currentItems.map((offer) => (
                <Card
                  key={offer._id}
                  onClick={(e) => openUserSite(e, offer?.businessName)}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-full bg-white dark:bg-gray-800"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        {offer.title}
                      </CardTitle>
                      {offer.discount && (
                        <span className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                          {offer.discount} OFF
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {offer.businessName && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {offer.businessName}
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pb-3 flex-grow">
                    {offer.description && (
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {offer.description}
                      </p>
                    )}

                    <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
                      {offer.startDate && (
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          Starts: {formatDate(offer.startDate)}
                        </div>
                      )}
                      {offer.expiryDate && (
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          Expires: {formatDate(offer.expiryDate)}
                        </div>
                      )}
                    </div>

                    {offer.originalPrice && offer.discountedPrice && (
                      <div className="mt-3 flex items-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          ${offer.discountedPrice}
                        </span>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                          ${offer.originalPrice}
                        </span>
                      </div>
                    )}
                  </CardContent>

                  {offer.contact && (
                    <CardFooter className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={() => openWhatsApp(offer.contact)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-orange-500 text-white w-full py-2 transition-colors"
                      >
                        <MessageCircle size={18} />
                        Contact via WhatsApp
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 mb-16 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronsLeft size={16} />
                </Button>

                <Button
                  variant="outline"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft size={16} />
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show limited page numbers with ellipsis for many pages
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            onClick={() => paginate(page)}
                            className="w-10 h-10 p-0"
                          >
                            {page}
                          </Button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2 py-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight size={16} />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  <ChevronsRight size={16} />
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default DisplayOffer;
