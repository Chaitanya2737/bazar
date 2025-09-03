"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ReviewSection({ userId, reviewID }) {
  const [reviews, setReviews] = useState([]);
  const [newReviews, setNewReviews] = useState([
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("ReviewID:", reviewID);

  // Fetch reviews from backend
  useEffect(() => {
    if (!reviewID) {
      console.warn("Skipping fetch: reviewID is undefined");
      setReviews([]);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    async function fetchReviews() {
      setFetchLoading(true);
      setError(null);
      try {
        const res = await axios.post(
          "/api/user/review/preview",
          { ReviewId: reviewID },
          { signal: controller.signal }
        );
        if (isMounted) {
          // Handle both possible response structures
          console.log(res.data.review.reviews);
          if (res.data?.review && Array.isArray(res.data.review.reviews)) {
            setReviews(res.data.review.reviews);
          } else if (res.data.review) {
            // Convert single review object to array
            setReviews([res.data.review]);
          } else {
            console.warn("Unexpected API response structure:", res.data);
            setReviews([]);
            setError("Unexpected response from server. Please try again.");
          }
        }
      } catch (error) {
        if (isMounted && error.name !== "AbortError") {
          console.error("Error fetching reviews:", error);
          setError(
            error.response?.status === 400
              ? "Invalid review ID. Please check and try again."
              : "Failed to load reviews. Please try again."
          );
          setReviews([]);
        }
      } finally {
        if (isMounted) {
          setFetchLoading(false);
        }
      }
    }

    fetchReviews();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [reviewID]); // Re-run when reviewID changes

  // Handle input change
  const handleChange = (index, field, value) => {
    const updated = [...newReviews];
    updated[index][field] = value;
    setNewReviews(updated);
  };

  // Add new input group
  const addInputGroup = () => {
    setNewReviews([...newReviews, { title: "", description: "" }]);
  };

  // Submit all reviews
  const handleSubmit = async () => {
    const validReviews = newReviews.filter(
      (r) => r.title.trim() && r.description.trim()
    );

    if (validReviews.length === 0) {
      setError(
        "Please provide at least one review with a title and description."
      );
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("/api/user/review/add-review", {
        userID: userId,
        reviews: validReviews,
      });
      if (res.data && Array.isArray(res.data.reviews)) {
        setReviews(res.data.reviews);
        setNewReviews([
          { title: "", description: "" },
          { title: "", description: "" },
          { title: "", description: "" },
        ]);
        toast.success("Reviews submitted successfully!");
      } else {
        console.warn("Unexpected API response structure:", res.data);
        setError("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("Failed to submit reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-center">User Reviews</h2>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-center mb-4" role="alert">
          {error}
        </p>
      )}

      {/* Dynamic Review Inputs */}
      <div className="flex flex-col gap-6 mb-6">
        {newReviews.map((review, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-sm flex flex-col gap-3"
          >
            <label htmlFor={`title-${index}`} className="sr-only">
              Review Title
            </label>
            <input
              id={`title-${index}`}
              type="text"
              placeholder="Review title"
              value={review.title}
              onChange={(e) => handleChange(index, "title", e.target.value)}
              className="border rounded-lg px-3 py-2"
              required
            />

            <label htmlFor={`description-${index}`} className="sr-only">
              Review Description
            </label>
            <textarea
              id={`description-${index}`}
              placeholder="Review description"
              value={review.description}
              onChange={(e) =>
                handleChange(index, "description", e.target.value)
              }
              className="border rounded-lg px-3 py-2"
              rows={2}
              required
            />
          </div>
        ))}

        <Button variant="outline" onClick={addInputGroup} disabled={loading}>
          + Add Another Review
        </Button>

        <Button onClick={handleSubmit} disabled={loading || fetchLoading}>
          {loading ? "Submitting..." : "Submit Reviews"}
        </Button>
      </div>

      {/* Reviews List */}
      <div className="grid gap-4">
        {fetchLoading ? (
          <p className="text-gray-500 text-center" aria-live="polite">
            Loading reviews...
          </p>
        ) : reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <Card key={review.id || idx} className="shadow-md">
              <CardHeader>
                <CardTitle>{review.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {review.description && (
                  <p className="text-gray-600 mb-1">{review.description}</p>
                )}
                {review.extra && (
                  <p className="text-gray-500 italic">{review.extra}</p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 text-center" aria-live="polite">
            No reviews available.
          </p>
        )}
      </div>
    </section>
  );
}
