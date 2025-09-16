"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useSelector } from "react-redux";

export default function OfferDateDrawer() {
  const [title, setTitle] = useState("");
  const [intervalDays, setIntervalDays] = useState(null); // 7, 12, 21
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selector = useSelector((state) => state.userAuth);
  const user = useSelector((state) => state.userdata?.userData);

  const userId = user?._id || selector?._id;
  const businessName = user?.businessName;
  const contact = user?.mobileNumber?.[0];
  const category = user?.categories;

  console.log(businessName);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (!title.trim()) {
        toast.error("Offer title is required");
        setIsSubmitting(false);
        return;
      }
      if (!intervalDays) {
        toast.error("Please select an interval (7, 12, 21 days)");
        setIsSubmitting(false);
        return;
      }
      console.log(businessName);

      const payload = {
        userId,
        title,
        interval: intervalDays,
        businessName,
        contact,
        category,
      };

      const res = await axios.post("/api/user/siteoffer", payload);
      console.log(contact, "contact");

      if (res.data.success) {
        toast.success("Offer added successfully 🎉");
        setTitle("");
        setIntervalDays(null);
      } else {
        toast.error(res.data.message || "Failed to add offer");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while saving offer"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">+ Add Offer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>🎁 Create Offer</DrawerTitle>
          </DrawerHeader>

          <div className="p-4 space-y-6">
            {/* Offer Title */}
            <div>
              <label className="block mb-1 font-medium" htmlFor="offer-title">
                Offer Title
              </label>
              <Input
                id="offer-title"
                type="text"
                placeholder="Enter offer title (e.g., 20% Discount)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Interval Options */}
            <fieldset>
              <legend className="mb-2 font-medium">📅 Valid For</legend>
              <div className="space-y-2">
                {[7, 12, 21, 64, 182, 365].map((days) => (
                  <label
                    key={days}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="days"
                      value={days}
                      checked={intervalDays === days}
                      onChange={() => setIntervalDays(days)}
                    />
                    {days} Days (till{" "}
                    {(() => {
                      const date = new Date();
                      date.setDate(date.getDate() + days);
                      return date.toLocaleDateString();
                    })()}
                    )
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <DrawerFooter>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Saving..." : "Save Offer"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
