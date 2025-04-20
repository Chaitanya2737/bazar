"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { userAddingField } from "@/constant/helper";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Trash2,
  Plus,
} from "lucide-react";
import { resetUser, updateUser } from "@/redux/slice/user/userSlice";
import { createUserApi } from "@/redux/slice/user/serviceApi";

// Parent Component
const AddUserComponent = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.user);
  console.log(selector);

  

  const [formData, setFormData] = useState(userAddingField);
  const [localFile, setLocalFile] = useState(null);

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
  

  const setValue = (e) => {
    const { name, value, files } = e.target;

    if (name === "businessIcon") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const setToStore = () => {
    try {
      dispatch(updateUser(formData));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!localFile) {
        console.warn("No file selected.");
        return;
      }
  
      // Step 1: Update the user info
      await dispatch(updateUser(formData));
  
      // Step 2: Prepare new FormData for file upload
      const newFormData = new FormData();
      newFormData.append("businessIcon", localFile)
      newFormData.append("userdata", JSON.stringify(formData));
  
      // Step 3: Dispatch the file + userdata
      await dispatch(createUserApi(newFormData));
  
      // Step 4: Reset after success
      await dispatch(resetUser());
  
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };
  
  return (
    <div className="text-black dark:bg-gray-800 dark:text-white p-4">
      <div className="md:col-span-2 mt-5">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
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
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Business Information
        </h2>
      </div>
      {isOpen.BusinessCategories && (
        <BusinessCategories
          formData={formData}
          setValue={setValue}
          setIsOpen={setIsOpen}
          setLocalFile={setLocalFile}
        />
      )}

      <div className="md:col-span-2 mt-5">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Social Media Links
        </h2>
      </div>
      {isOpen.SocialMediaLink && (
        <SocialMediaLink
          formData={formData}
          setValue={setValue}
          setIsOpen={setIsOpen}
          setToStore={setToStore}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default AddUserComponent;
// Basic Categories
export const BasicCategories = ({
  formData,
  setValue,
  setIsOpen,
  onMobileChange,
}) => {
  const [errors, setErrors] = useState({});
  const [mobileNumbers, setMobileNumbers] = useState([""]);

  //  Notify parent when mobileNumbers change
  useEffect(() => {
    if (onMobileChange) {
      onMobileChange(mobileNumbers);
    }
  }, [mobileNumbers]);

  const validate = () => {
    const newErrors = {};

    if (!String(formData.handlerName).trim()) {
      newErrors.handlerName = "Handler name is required";
    }

    mobileNumbers.forEach((num, idx) => {
      const trimmed = String(num).trim();
      if (!trimmed) {
        newErrors[`mobile_${idx}`] = "Mobile number is required";
      } else if (!/^\d{10}$/.test(trimmed)) {
        newErrors[`mobile_${idx}`] = "Mobile number must be 10 digits";
      }
    });

    if (!String(formData.email).trim()) {
      newErrors.email = "Email is required";
    }

    if (!String(formData.password).trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validate()) {
      setValue({ target: { name: "mobileNumbers", value: mobileNumbers } });
      setIsOpen((prev) => ({ ...prev, BusinessCategories: true }));
    }
  };

  const handleMobileChange = (value, index) => {
    const updated = [...mobileNumbers];
    updated[index] = value;
    setMobileNumbers(updated);
  };

  const addMobileField = () => {
    setMobileNumbers((prev) => [...prev, ""]);
  };

  const removeMobileField = (index) => {
    const updated = [...mobileNumbers];
    updated.splice(index, 1);
    setMobileNumbers(updated);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        {/* Handler Name */}
        <div>
          <Label
            className={`${
              errors.handlerName ? "text-red-400 p-1 rounded" : ""
            }`}
            htmlFor="handlerName"
          >
            Handler Name
          </Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="handlerName"
            name="handlerName"
            value={formData.handlerName}
            onChange={setValue}
          />
          {errors.handlerName && (
            <p className="text-sm text-red-500 mt-1">{errors.handlerName}</p>
          )}
        </div>

        {/* Mobile Numbers */}
        {mobileNumbers.map((number, idx) => (
          <div key={`mobile_${idx}`} className="relative">
            <Label
              className={`${
                errors.handlerName ? "text-red-400 p-1 rounded" : ""
              }`}
              htmlFor={`mobile_${idx}`}
            >
              Mobile Number {idx + 1}
            </Label>
            <Input
              className="bg-gray-100 dark:bg-gray-700 mt-1 pr-10"
              id={`mobile_${idx}`}
              name={`mobile_${idx}`}
              value={number}
              onChange={(e) => handleMobileChange(e.target.value, idx)}
            />
            {errors[`mobile_${idx}`] && (
              <p className="text-sm text-red-500 mt-1">
                {errors[`mobile_${idx}`]}
              </p>
            )}
            <div className="absolute top-[33px] right-2 flex gap-2">
              {mobileNumbers.length > 1 && (
                <Trash2
                  className="w-5 h-5 text-red-500 cursor-pointer"
                  onClick={() => removeMobileField(idx)}
                />
              )}
              {idx === mobileNumbers.length - 1 && (
                <Plus
                  className="w-5 h-5 text-green-600 cursor-pointer"
                  onClick={addMobileField}
                />
              )}
            </div>
          </div>
        ))}

        {/* Email */}
        <div>
          <Label
            className={`${
              errors.handlerName ? "text-red-400 p-1 rounded" : ""
            }`}
            htmlFor="email"
          >
            Email
          </Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="email"
            name="email"
            value={formData.email}
            onChange={setValue}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label
            className={`${
              errors.handlerName ? "text-red-400 p-1 rounded" : ""
            }`}
            htmlFor="password"
          >
            Password
          </Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={setValue}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>
      </div>

      {/* Next Button */}
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

export const BusinessCategories = ({
  formData,
  setValue,
  setIsOpen,
  setLocalFile,
}) => {
  const [errors, setErrors] = useState({});

  const back = () =>
    setIsOpen((prev) => ({
      ...prev,
      BasicCategories: true,
      BusinessCategories: false,
    }));

  const validate = () => {
    const newErrors = {};

    if (!String(formData.businessName).trim())
      newErrors.businessName = "Business name is required";
    if (!String(formData.address).trim())
      newErrors.address = "Address is required";
    if (!String(formData.businessLocation).trim())
      newErrors.businessLocation = "Business location is required";
    if (!String(formData.categories).trim())
      newErrors.categories = "Categories is required";
    if (!String(formData.admin).trim())
      newErrors.admin = "Admin name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validate()) {
      console.log("next working");
      setIsOpen((prev) => ({ ...prev, SocialMediaLink: true }));
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        <div>
          <Label
            className={errors.businessName ? "text-red-500" : ""}
            htmlFor="businessName"
          >
            Business Name
          </Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={setValue}
          />
          {errors.businessName && (
            <p className="text-sm text-red-500 mt-1">{errors.businessName}</p>
          )}
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
            onChange={(e) => setLocalFile(e.target.files[0])}
          />
        </div>

        <div>
          <Label
            className={errors.address ? "text-red-500" : ""}
            htmlFor="address"
          >
            Address
          </Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="address"
            name="address"
            value={formData.address}
            onChange={setValue}
          />
          {errors.address && (
            <p className="text-sm text-red-500 mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <Label
            className={errors.businessLocation ? "text-red-500" : ""}
            htmlFor="businessLocation"
          >
            Business Location
          </Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="businessLocation"
            name="businessLocation"
            value={formData.businessLocation}
            onChange={setValue}
          />
          {errors.businessLocation && (
            <p className="text-sm text-red-500 mt-1">
              {errors.businessLocation}
            </p>
          )}
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
          <Label
            className={errors.categories ? "text-red-500" : ""}
            htmlFor="categories"
          >
            Categories
          </Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="categories"
            name="categories"
            value={formData.categories}
            onChange={setValue}
          />
          {errors.categories && (
            <p className="text-sm text-red-500 mt-1">{errors.categories}</p>
          )}
        </div>

        <div>
          <Label className={errors.admin ? "text-red-500" : ""} htmlFor="admin">
            Admin Name
          </Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="admin"
            name="admin"
            value={formData.admin}
            onChange={setValue}
          />
          {errors.admin && (
            <p className="text-sm text-red-500 mt-1">{errors.admin}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <Button
          onClick={back}
          variant="secondary"
          className="w-full flex items-center justify-center gap-2 group bg-gray-800 text-gray-100 dark:bg-gray-100 dark:text-gray-800"
        >
          <ArrowLeftFromLine className="w-4 h-4 group-hover:translate-x-2" />
          <span>Edit in Basic Categories</span>
        </Button>

        <Button
          onClick={next}
          variant="secondary"
          className="w-full flex items-center justify-center gap-2 group bg-gray-800 text-gray-100 dark:bg-gray-100 dark:text-gray-800"
        >
          <span>Add Social Media Link</span>
          <ArrowRightFromLine className="w-4 h-4 group-hover:translate-x-2" />
        </Button>
      </div>
    </>
  );
};

// Social Media Link

export const SocialMediaLink = ({
  formData,
  setValue,
  setIsOpen,
  setToStore,
  handleSubmit,
}) => {
  const back = () =>
    setIsOpen((prev) => ({
      ...prev,
      BusinessCategories: true,
      SocialMediaLink: false,
    }));

  const next = () => {
    try {
      setToStore();
      setIsOpen((prev) => ({
        ...prev,
        BasicCategories: false,
        BusinessCategories: false,
        SocialMediaLink: true,
      }));
      handleSubmit();
    } catch (error) {
      console.log(error);
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <Button
          onClick={back}
          variant="secondary"
          className="w-full flex items-center justify-center gap-2 group bg-gray-800 text-gray-100 dark:bg-gray-100 dark:text-gray-800"
        >
          <ArrowLeftFromLine className="w-4 h-4 group-hover:translate-x-2" />
          <span>Edit in Business Categories</span>
        </Button>

        <Button
          onClick={next}
          variant="secondary"
          className="w-full flex items-center justify-center gap-2 group bg-gray-800 text-gray-100 dark:bg-gray-100 dark:text-gray-800"
        >
          <span>Make Payment</span>
          <ArrowRightFromLine className="w-4 h-4 group-hover:translate-x-2" />
        </Button>
      </div>
    </>
  );
};
