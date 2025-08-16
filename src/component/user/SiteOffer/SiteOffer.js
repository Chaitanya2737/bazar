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
  const [interval, setinterval] = useState(null); // 7, 12, 21 or null

  const selector = useSelector((state) => state.userAuth);
  const user = useSelector((state) => state.userdata?.userData);

  const userId = user?._id || selector?._id;

  // Calculate offerDate based on interval or customDate
  const getOfferDate = () => {
    if (interval) {
      const date = new Date();
      date.setDate(date.getDate() + interval);
      return date.toISOString().split("T")[0]; // yyyy-mm-dd
    }
    return "";
  };

  const businessNameName = user?.businessName;
  const contact = user?.mobileNumber[0]


  const handleSubmit = async () => {
    const offerDate = getOfferDate();
    if (!title.trim()) {
      toast.error("Title required");
      return;
    }
    if (!offerDate) {
      toast.error("Date required");
      return;
    }
    console.log("Submitting offer:", { title, offerDate });
    // TODO: send data to backend here
    const res = await axios.post("/api/user/siteoffer", {
      userId,
      title,
      interval,
      businessNameName,
      contact
    });
    console.log(res.data);
  };

  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Set Offer Date</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Create Offer</DrawerTitle>
          </DrawerHeader>

          <div className="p-4 space-y-4">
            <div>
              <label className="block mb-1 font-medium" htmlFor="offer-title">
                Offer Title
              </label>
              <Input
                id="offer-title"
                type="text"
                placeholder="Enter offer title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <fieldset>
              <legend className="mb-2 font-medium">Choose preset days</legend>
              {[7, 12, 21].map((days) => (
                <label
                  key={days}
                  className="flex items-center gap-2 mb-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="days"
                    value={days}
                    checked={interval === days}
                    onChange={() => {
                      setinterval(days);
                      // clear custom date if preset selected
                    }}
                  />
                  {days} Days
                </label>
              ))}
            </fieldset>
          </div>

          <DrawerFooter>
            <Button onClick={handleSubmit}>Save Offer</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
