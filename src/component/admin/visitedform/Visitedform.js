"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import axios from "axios";

const initialValue = {
  name: "",
  phone: "",
  ranking: 30,
  location: null,
};

const id = "68088f53cb58e586a9e1e6c0";

const Visitedform = () => {
  const [step, setStep] = useState(1);
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  const totalSteps = 3;

  const next = () => setStep((s) => Math.min(s + 1, totalSteps));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  /* ---------------- VALIDATION (TOAST) ---------------- */

  const validateStep1 = () => {
    toast.dismiss();
    if (!value.name.trim()) {
      toast.error("Client name is required");
      return false;
    }
    if (value.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    toast.dismiss();
    if (!value.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(value.phone)) {
      toast.error("Enter a valid 10-digit mobile number");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    toast.dismiss();
    if (value.ranking < 0 || value.ranking > 100) {
      toast.error("Interest level must be between 0 and 100");
      return false;
    }
    return true;
  };

  /* ---------------- LOCATION ---------------- */

  const successHandler = (pos) => {
    submitToBackend(
      {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      },
      "allowed"
    );
  };

  const errorHandler = (err) => {
    let status = "unknown_error";
    if (err.code === 1) status = "permission_denied";
    if (err.code === 2) status = "position_unavailable";
    if (err.code === 3) status = "timeout";

    toast.warning("Location not available, submitting without GPS");
    submitToBackend(null, status);
  };

  const handleSubmit = () => {
    if (!validateStep3()) return;

    if (!("geolocation" in navigator)) {
      submitToBackend(null, "not_supported");
      return;
    }

    toast.info("Please enable GPS & Wi-Fi for accurate location");

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
    });
  };

  /* ---------------- SUBMIT ---------------- */

  const submitToBackend = async (location, status) => {
    try {
      setLoading(true);

      const payload = {
        ...value,
        location: location
          ? {
              lng: location.lng,
              lat: location.lat,
              accuracy: location.accuracy,
            }
          : null,
        locationStatus: status,
        submittedAt: new Date().toISOString(),
        adminId: id,
        adminName: "chaitanya",
      };

      await axios.post("/api/admin/savevisitedclient", payload);

      toast.success("Congrats! You earned 10 reward points 🎉");
      setValue(initialValue);
      setStep(1);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getEmoji = (rank) => {
    if (rank < 30) return "🥱";
    if (rank < 60) return "🙂";
    if (rank < 85) return "😃";
    return "🔥";
  };

  /* ---------------- UI ---------------- */

  return (
    <Card className="w-full max-w-md mx-auto rounded-2xl shadow-lg dark:bg-neutral-700 dark:text-white">
      <CardHeader className="text-center">
        <h2 className="text-lg font-semibold">Submit Visit & Earn Points</h2>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <Input
              autoFocus
              className="h-12"
              placeholder="Client name"
              value={value.name}
              onChange={(e) => setValue({ ...value, name: e.target.value })}
            />
            <Button
              className="h-12 w-full"
              onClick={() => validateStep1() && next()}
            >
              Continue
            </Button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <Input
              autoFocus
              className="h-12"
              placeholder="Client phone number"
              value={value.phone}
              onChange={(e) => setValue({ ...value, phone: e.target.value })}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={back}>
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={() => validateStep2() && next()}
              >
                Add Ranking
              </Button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <p className="font-medium text-center">Client Interest Level</p>

            <div className="relative pt-6">
              <div
                className="absolute -top-1 text-2xl transition-all"
                style={{ left: `calc(${value.ranking}% - 15px)` }}
              >
                {getEmoji(value.ranking)}
              </div>

              <Slider
                value={[value.ranking]}
                max={100}
                step={1}
                onValueChange={(val) => setValue({ ...value, ranking: val[0] })}
                className="
                  [&_[data-orientation=horizontal]]:h-3
                  [&_[data-orientation=horizontal]_span]:h-3
                  [&_[role=slider]]:h-6
                  [&_[role=slider]]:w-6
                "
              />
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Location will be captured on submit
            </p>

            <div className="flex gap-2">
              <Button variant="outline" onClick={back}>
                Back
              </Button>
              <Button
                className="flex-1"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? "Submitting..." : "Finish Visit"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Visitedform;
