"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast, Toaster } from "sonner";


const initialValue = {
  name: "",
  phone: "",
  ranking: 30,
  location: null,
};

const Visitedform = () => {
  const [step, setStep] = useState(1);

  const [value, setValue] = useState(initialValue);

  const totalSteps = 3;

  const next = () => setStep((s) => Math.min(s + 1, totalSteps));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  // 📍 LOCATION ON SUBMIT
  const handleSubmit = () => {
    if (!("geolocation" in navigator)) {
      submitToBackend(null, "not_supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        submitToBackend(
          {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
          "allowed"
        );
      },
      () => {
        submitToBackend(null, "denied");
      },
      { timeout: 10000 }
    );
  };

  const getEmoji = (rank) => {
    if (rank < 30) return "🥱";
    if (rank < 60) return "🙂";
    if (rank < 85) return "😃";
    return "🔥";
  };

  const submitToBackend = (location, status) => {
    const payload = {
      ...value,
      location,
      locationStatus: status,
      submittedAt: new Date().toISOString(),
    };

    console.log("FINAL PAYLOAD 👉", payload);
    toast.success("contract you have earn 10 rewards point");
    setValue(initialValue)
    setStep(1)
  };

  return (
    <Card className="w-full max-w-md mx-auto  rounded-2xl shadow-lg dark:bg-neutral-700 dark:text-white ">
      <CardHeader className="space-y-2 text-center">
        <h2 className="text-lg font-semibold">Submit Visit & Earn Points</h2>

        <div className="w-full flex justify-between items-center relative">
          {/* Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-muted rounded-full -z-10"></div>

          {/* Steps */}
          {[...Array(totalSteps)].map((_, i) => {
            const stepNum = i + 1;
            const isActive = step >= stepNum;

            return (
              <div
                key={i}
                className={`relative flex flex-col items-center text-center w-full`}
              >
                {/* Circle */}
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
            ${
              isActive
                ? "bg-primary text-white border-primary"
                : "bg-white text-muted-foreground border-muted"
            }`}
                >
                  {stepNum}
                </div>

                {/* Optional label */}
                {/* <span className="text-xs mt-1">Step {stepNum}</span> */}
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <Input
              className="h-12 text-base"
              placeholder="Client name"
              value={value.name}
              onChange={(e) => setValue({ ...value, name: e.target.value })}
            />

            <Button
              className="h-12 w-full"
              disabled={!value.name}
              onClick={next}
            >
              Continue
            </Button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <Input
              className="h-12 text-base"
              placeholder="Client phone number"
              value={value.phone}
              onChange={(e) => setValue({ ...value, phone: e.target.value })}
            />

            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="h-12" onClick={back}>
                Back
              </Button>
              <Button
                className="h-12 flex-1"
                // disabled={value.phone.length < 10}
                onClick={next}
              >
                Add Ranking
              </Button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div className="space-y-5">
              <p className="font-medium text-center">Client Interest Level</p>

              {/* Slider Wrapper */}
              <div className="relative pt-6">
                {/* Emoji over thumb */}
                <div
                  className="absolute -top-1 text-2xl transition-all"
                  style={{
                    left: `calc(${value.ranking}% - 15px)`,
                  }}
                >
                  {getEmoji(value.ranking)}
                </div>

                <Slider
                  value={[value.ranking]}
                  max={100}
                  step={1}
                  onValueChange={(val) =>
                    setValue({ ...value, ranking: val[0] })
                  }
                />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground dark:text-gray-400">
                <span>Cold</span>
                <span>Hot</span>
              </div>

              <div className="text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  Score: {value.ranking}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground dark:text-gray-400 text-center">
              Location will be captured on submit
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="h-12" onClick={back}>
                Back
              </Button>
              <Button className="h-12 flex-1" onClick={handleSubmit}>
                Finish Visit
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Visitedform;
