"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

export default function ReviewSection({ userId, reviewID }) {
  const [reviews, setReviews] = useState([]);
  const [newReviews, setNewReviews] = useState([{ title: "", description: "" }]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  // Fetch reviews from backend
  useEffect(() => {
    if (!reviewID) {
      setReviews([]);
      return;
    }

    const controller = new AbortController();

    async function fetchReviews() {
      setFetchLoading(true);
      try {
        const res = await axios.post(
          "/api/user/review/preview",
          { ReviewId: reviewID },
          { signal: controller.signal }
        );

        if (res.data?.review?.reviews) {
          setReviews(res.data.review.reviews);
        } else if (res.data?.review) {
          setReviews([res.data.review]);
        } else {
          toast.error("Unexpected server response. Please try again.");
          setReviews([]);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching reviews:", error);
          toast.error("Failed to load reviews.");
          setReviews([]);
        }
      } finally {
        setFetchLoading(false);
      }
    }

    fetchReviews();
    return () => controller.abort();
  }, [reviewID]);

  // Handle input change
  const handleChange = (index, field, value) => {
    setNewReviews((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  // Add new input group
  const addInputGroup = () => {
    setNewReviews((prev) => [...prev, { title: "", description: "" }]);
  };

  // Submit all reviews
  const handleSubmit = async () => {
    const validReviews = newReviews.filter(
      (r) => r.title.trim() && r.description.trim()
    );

    if (validReviews.length === 0) {
      toast.error("Please provide at least one valid review.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/user/review/add-review", {
        userID: userId,
        reviews: validReviews,
      });

      if (res.data?.reviews) {
        setReviews(res.data.reviews);
        setNewReviews([{ title: "", description: "" }]);
        toast.success("Reviews submitted successfully!");
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit reviews.");
    } finally {
      setLoading(false);
    }
  };

  // Delete review
  const handleDelete = async (itemID) => {
    if (!itemID) {
      toast.error("Invalid review ID");
      return;
    }

    try {
      const res = await axios.delete("/api/user/review/delete", {
        data: { reviewID, itemID },
      });

      if (res.data.success) {
        if (res.data.data?.reviews) {
          setReviews(res.data.data.reviews);
        } else {
          setReviews((prev) => prev.filter((r) => r._id !== itemID));
        }
        toast.success("Review deleted successfully!");
      } else {
        toast.error(res.data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("❌ Error deleting review:", error);
      toast.error("Something went wrong while deleting review.");
    }
  };

  return (
    <section className="max-w-5xl mx-auto p-6 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-6 text-center">User Reviews</h2>

      {/* Dynamic Review Inputs */}
      <div className="flex flex-col gap-4 mb-6">
        {newReviews.map((review, index) => (
          <div
            key={index}
            className="p-4 border rounded-xl shadow-sm flex flex-col gap-3 bg-gray-50 dark:bg-gray-800"
          >
            <Input
              type="text"
              placeholder="Review title"
              value={review.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
              required
            />
            <Textarea
              placeholder="Review description"
              value={review.description}
              onChange={(e) => handleChange(index, "description", e.target.value)}
              rows={2}
              required
            />
          </div>
        ))}

        <div className="flex gap-3">
          <Button variant="outline" onClick={addInputGroup} disabled={loading}>
            <Plus className="w-4 h-4 mr-1" /> Add Another
          </Button>
          <Button onClick={handleSubmit} disabled={loading || fetchLoading}>
            {loading ? "Submitting..." : "Submit Reviews"}
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid gap-4">
        {fetchLoading ? (
          <p className="text-gray-500 text-center">Loading reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review._id} className="shadow-md hover:shadow-lg transition">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>{review.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(review._id)}
                  className="hover:bg-red-50 dark:hover:bg-red-900"
                >
                  <Trash2 className="text-red-500" />
                </Button>
              </CardHeader>
              <CardContent>
                {review.description && (
                  <p className="text-gray-600 dark:text-gray-300">{review.description}</p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 text-center">No reviews available.</p>
        )}
      </div>
    </section>
  );
}
