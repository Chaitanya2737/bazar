"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { userAddingField } from "@/constant/helper";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";

// Parent Component
const AddUserComponent = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(userAddingField);
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("collapse");
      return saved
        ? JSON.parse(saved)
        : {
            BasicCategories: true,
            BusinessCategories: false,
            SocialMediaLink: false,
          };
    }
    return {
      BasicCategories: true,
      BusinessCategories: false,
      SocialMediaLink: false,
    };
  });

  useEffect(() => {
    localStorage.setItem("collapse", JSON.stringify(isOpen));
  }, [isOpen]);

  const setValue = useCallback((e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files?.[0] || value,
    }));
  }, []);

  return (
    <div className="text-black dark:text-white p-4">
      <div className="md:col-span-2 mt-5">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Basic Fields
        </h2>
      </div>
      {isOpen.BasicCategories && (
        <BasicCategories
          formData={formData}
          setValue={setValue}
          setIsOpen={setIsOpen}
        />
      )}

      <div className="md:col-span-2 mt-5">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Business Information
        </h2>
      </div>
      {isOpen.BusinessCategories && (
        <BusinessCategories
          formData={formData}
          setValue={setValue}
          setIsOpen={setIsOpen}
        />
      )}

      <div className="md:col-span-2 mt-5">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Social Media Links
        </h2>
      </div>
      {isOpen.SocialMediaLink && (
        <SocialMediaLink
          formData={formData}
          setValue={setValue}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
};

export default AddUserComponent;

// Basic Categories
export const BasicCategories = ({ formData, setValue, setIsOpen }) => {
  const next = () =>
    setIsOpen((prev) => ({ ...prev, BusinessCategories: true }));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        <div>
          <Label htmlFor="handlerName">Handler Name</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="handlerName"
            name="handlerName"
            value={formData.handlerName}
            onChange={setValue}
          />
        </div>
        <div>
          <Label htmlFor="mobileNumber">Mobile Number</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={setValue}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="email"
            name="email"
            value={formData.email}
            onChange={setValue}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={setValue}
          />
        </div>
      </div>
      <div className="grid place-items-center mt-3 w-full">
        <Button
          onClick={next}
          variant="secondary"
          className="w-full flex items-center justify-center gap-2 group bg-gray-800 text-gray-100 dark:bg-gray-100 dark:text-gray-800"
        >
          <span className="text-sm font-medium">Add Business Categories</span>
          <ArrowRightFromLine className="w-4 h-4 transition-transform group-hover:translate-x-2" />
        </Button>
      </div>
    </>
  );
};

// Business Categories
export const BusinessCategories = ({ formData, setValue, setIsOpen }) => {
  const back = () =>
    setIsOpen((prev) => ({ ...prev, BusinessCategories: false }));

  const next = () =>
    setIsOpen((prev) => ({ ...prev, SocialMediaLink: true }));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={setValue}
          />
        </div>
        <div>
          <Label htmlFor="bio">Business Bio / Description</Label>
          <Textarea
            className="mt-2"
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={setValue}
          />
        </div>
        <div>
          <Label htmlFor="businessIcon">Business Icon</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="businessIcon"
            type="file"
            name="businessIcon"
            onChange={setValue}
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="address"
            name="address"
            value={formData.address}
            onChange={setValue}
          />
        </div>
        <div>
          <Label htmlFor="businessLocation">Business Location</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="businessLocation"
            name="businessLocation"
            value={formData.businessLocation}
            onChange={setValue}
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="state"
            name="state"
            value={formData.state}
            onChange={setValue}
          />
        </div>
        <div>
          <Label htmlFor="GstNumber">GST Number</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="GstNumber"
            name="GstNumber"
            value={formData.GstNumber}
            onChange={setValue}
          />
        </div>
        <div>
          <Label htmlFor="language">Language</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="language"
            name="language"
            value={formData.language}
            onChange={setValue}
          />
        </div>
        <div>
          <Label htmlFor="categories">Categories</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="categories"
            name="categories"
            value={formData.categories}
            onChange={setValue}
          />
        </div>
        <div>
          <Label htmlFor="admin">Admin Name</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="admin"
            name="admin"
            value={formData.admin}
            onChange={setValue}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <Button onClick={back} variant="secondary" className="w-full flex gap-2">
          <ArrowLeftFromLine className="w-4 h-4 group-hover:translate-x-2" />
          <span>Edit in Basic Categories</span>
        </Button>

        <Button onClick={next} variant="secondary" className="w-full flex gap-2">
          <span>Add Social Media Link</span>
          <ArrowRightFromLine className="w-4 h-4 group-hover:translate-x-2" />
        </Button>
      </div>
    </>
  );
};

// Social Media Link
export const SocialMediaLink = ({ formData, setValue, setIsOpen }) => {
  const back = () =>
    setIsOpen((prev) => ({ ...prev, SocialMediaLink: false }));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        <div>
          <Label htmlFor="insta">Instagram</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="insta"
            name="insta"
            value={formData?.insta || ""}
            onChange={setValue}
          />
        </div>
        <div>
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="facebook"
            name="facebook"
            value={formData?.facebook || ""}
            onChange={setValue}
          />
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="linkedin"
            name="linkedin"
            value={formData?.linkedin || ""}
            onChange={setValue}
          />
        </div>
        <div>
          <Label htmlFor="youtube">YouTube</Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="youtube"
            name="youtube"
            value={formData?.youtube || ""}
            onChange={setValue}
          />
        </div>
      </div>

      <div className="grid place-items-center mt-5 w-full">
        <Button onClick={back} variant="secondary" className="w-full flex gap-2">
          <ArrowLeftFromLine className="w-4 h-4 group-hover:translate-x-2" />
          <span>Edit Business Info</span>
        </Button>
      </div>
    </>
  );
};
