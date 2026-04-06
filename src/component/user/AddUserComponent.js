"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { userAddingField } from "@/constant/helper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Trash2,
  Plus,
  FileText,
  CreditCard,
} from "lucide-react";
import { resetUser, updateUser } from "@/redux/slice/user/addUserSlice";
import { createUserApi } from "@/redux/slice/user/serviceApi";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import ProcessingModal from "@/app/testing/page";

// Parent Component
const AddUserComponent = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.user);
  const [formData, setFormData] = useState(userAddingField);
  const [localFile, setLocalFile] = useState(null);
  const [submitError, setSubmitError] = useState(null); // For user feedback
  const [isSubmitted, setIsSubmited] = useState(false);
  const navigation = useRouter();

  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("collapse");
      return saved
        ? JSON.parse(saved)
        : {
            BasicCategories: true,
            BusinessCategories: false,
            DeviceActivations: false,
            SocialMediaLink: false,
            TermsConditions: false, // 🆕 Add this
          };
    }
    return {
      BasicCategories: true,
      BusinessCategories: false,
      DeviceActivations: false,
      SocialMediaLink: false,
      TermsConditions: false, // 🆕
    };
  });

  useEffect(() => {
    localStorage.setItem("collapse", JSON.stringify(isOpen));
  }, [isOpen]);

const setValue = useCallback((e) => {
  const { name, value, files } = e.target;

  // ✅ handle file safely
  if (name === "businessIcon") {
    const file = files?.[0] || value; // 👈 FIX

    setFormData((prev) => ({
      ...prev,
      businessIcon: file,
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
}, []);

  const handleSubmit = async () => {
    try {
      setIsSubmited(true); // Set submitting state immediately
      // 1. File validation
      if (!localFile) {
        setSubmitError("Please select a business icon file.");
        return;
      }

      // 2. Prepare form data
      const newFormData = new FormData();
      newFormData.append("businessIcon", localFile);
      newFormData.append("userdata", JSON.stringify(formData));

      // 3. Save values before reset
      const businessName = formData.businessName;
      const status = "success";

      // 4. Dispatch thunk
      let data = createUserApi(newFormData);
      const result = await dispatch(createUserApi(newFormData));
      // 5. Handle rejection manually
      if (createUserApi.rejected.match(result)) {
        // Safely extract error message from payload
        const errorMessage =
          typeof result.payload === "string"
            ? result.payload
            : result.payload?.message || "Failed to create user.";
        throw new Error(errorMessage);
      }

      // 6. On success: reset everything
      await dispatch(resetUser());
      setFormData(userAddingField);
      setLocalFile(null);
      setSubmitError(null);
      setIsSubmited(false); // Reset submitting state
      toast.success(`User "${businessName}" created successfully!`);

      // 7. Reset UI state
      setIsOpen({
        BasicCategories: true,
        BusinessCategories: false,
        SocialMediaLink: false,
      });
      // 8. Navigate to success page
      navigation.push(
        `/adduser/success/${encodeURIComponent(businessName)}/${status}`,
      );
    } catch (error) {
      // 9. Show friendly error message
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Something went wrong.";
      setIsSubmited(false);
      setSubmitError(message);
      toast.error(`❌ ${message}`);
      console.error("User creation failed:", error);
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
          localFile={localFile}
        />
      )}

      <div className="md:col-span-2 mt-5">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Device Activations
        </h2>
      </div>

      {isOpen.DeviceActivations && (
        <DeviceActivations
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
          handleSubmit={handleSubmit}
          isSubmitted={isSubmitted}
        />
      )}

      <div className="md:col-span-2 mt-5">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Terms & Conditions
        </h2>
      </div>
      {isOpen.TermsConditions && (
        <TermsConditions
          formData={formData}
          setIsOpen={setIsOpen}
          handleSubmit={handleSubmit}
          isSubmitted={isSubmitted}
          setFormData={setFormData}
        />
      )}

      <div className="md:col-span-2 mt-5">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Payment
        </h2>
      </div>
      {isOpen.Payments && (
        <Payment
          formData={formData}
          setIsOpen={setIsOpen}
          handleSubmit={handleSubmit}
          isSubmitted={isSubmitted}
          setFormData={setFormData}
        />
      )}

      {submitError && (
        <p className="text-sm text-red-500 mt-3 text-center">{submitError}</p>
      )}
    </div>
  );
};

export default AddUserComponent;









// Basic Categories
export const BasicCategories = ({ formData, setValue, setIsOpen }) => {
  const [errors, setErrors] = useState({});
  const [mobileNumbers, setMobileNumbers] = useState([""]);

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

    const emailTrimmed = String(formData.email).trim();
    if (!emailTrimmed) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      newErrors.email = "Invalid email format";
    }

    const passwordTrimmed = String(formData.password).trim();
    if (!passwordTrimmed) {
      newErrors.password = "Password is required";
    } else if (passwordTrimmed.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validate()) {
      setValue({ target: { name: "mobileNumbers", value: mobileNumbers } });
      setIsOpen((prev) => ({
        ...prev,
        BusinessCategories: true,
        BasicCategories: false,
      }));
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
            className={errors.handlerName ? "text-red-400 p-1 rounded" : ""}
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
              className={
                errors[`mobile_${idx}`] ? "text-red-400 p-1 rounded" : ""
              }
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
            className={errors.email ? "text-red-400 p-1 rounded" : ""}
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
            className={errors.password ? "text-red-400 p-1 rounded" : ""}
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
  localFile,
}) => {
  const [errors, setErrors] = useState({});

  const [categorie, setCategorie] = useState([]);
  const { id } = useParams();
  const [adminId, setAdminId] = useState(id || "");

  const back = () =>
    setIsOpen((prev) => ({
      ...prev,
      BasicCategories: true,
      BusinessCategories: false,
    }));

  const validate = () => {
    const newErrors = {};

    if (!String(formData.businessName || "").trim())
      newErrors.businessName = "Business name is required";

    if (!String(formData.address || "").trim())
      newErrors.address = "Address is required";

    if (!String(formData.businessLocation || "").trim())
      newErrors.businessLocation = "Business location is required";

    if (!String(formData.categories || "").trim())
      newErrors.categories = "Categories is required";

    // ✅ Logo required (edit safe)
    if (!localFile && !formData.businessIcon) {
      newErrors.businessIcon = "Business logo is required";
    }

    setErrors(newErrors);

    // ✅ Show only first error
    const firstError = Object.values(newErrors)[0];
    if (firstError) {
      toast.error(firstError);
    }

    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validate()) {
      setIsOpen((prev) => ({
        ...prev,
        BusinessCategories: false,
        DeviceActivations: true,
      }));
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/categorie/preview");
      setCategorie(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (id) {
      setValue({ target: { name: "admin", value: id } });
    }
  }, [id, setValue]);

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
            onChange={(e) => {
              const file = e.target.files[0];

              // ✅ store in formData (MAIN FIX)
              setValue({
                target: {
                  name: "businessIcon",
                  value: file,
                },
              });

              // ✅ optional (keep for preview if needed)
              setLocalFile(file);
            }}
          />
          {errors.businessIcon && (
            <p className="text-sm text-red-500 mt-1">{errors.businessIcon}</p>
          )}
          
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

          {/* Give the input a unique id so it doesn't conflict with the select */}
          {/* <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            id="categoriesInput"
            name="categories"
            value={formData.categories}
            onChange={setValue} // <-- OK if setValue expects an event
          /> */}

          <Select
            value={formData.categories}
            onValueChange={(val) =>
              setValue({ target: { name: "categories", value: val } })
            }
          >
            <SelectTrigger className="w-full text-black dark:text-white">
              <SelectValue placeholder="-- Select category --" className="" />
            </SelectTrigger>
            <SelectContent
              style={{ WebkitOverflowScrolling: "touch" }}
              className="max-h-[60vh] select-scroll overflow-auto rounded-md shadow-lg select-scroll"
            >
              {categorie.map((item) => (
                <SelectItem className={"h-10"} key={item._id} value={item._id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
            value={formData.admin ?? id ?? ""} // preferred: show formData.admin if already set
            readOnly
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
          <span>Device Activations</span>
          <ArrowRightFromLine className="w-4 h-4 group-hover:translate-x-2" />
        </Button>
      </div>
    </>
  );
};

export const DeviceActivations = ({
  setIsOpen,
  formData,
  isSubmitted,
  setValue,
}) => {
  const back = () =>
    setIsOpen((prev) => ({
      ...prev,
      BusinessCategories: true,
      DeviceActivations: false,
    }));

  const next = () =>
    setIsOpen((prev) => ({
      ...prev,
      SocialMediaLink: true,
      DeviceActivations: false,
    }));

  const handleActivationChange = (value) => {
    setValue({
      target: {
        name: "maxDevices",
        value: value,
      },
    });
  };

  const handlePlanChange = (value) => {
    setValue({
      target: {
        name: "subscriptionPlan",
        value: value,
      },
    });
  };

  return (
    <>
      <div className="space-y-5 mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subscription Plan */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Subscription Plan
            </label>

            <Select
              value={formData?.subscriptionPlan || ""}
              onValueChange={handlePlanChange}
              disabled={isSubmitted}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Device Activations */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Maximum Device Activations
            </label>

            <Select
              value={formData?.maxDevices || "1"}
              onValueChange={handleActivationChange}
              disabled={isSubmitted || !formData?.subscriptionPlan}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select activation count" />
              </SelectTrigger>

              <SelectContent className="max-h-60">
                {Array.from({ length: 100 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* License Validity */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium block mb-1">
              License Validity
            </label>

            <div className="w-full rounded-md border px-3 py-2 bg-muted text-sm">
              8 Years
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <Button
          onClick={back}
          variant="secondary"
          disabled={isSubmitted}
          className="w-full flex items-center justify-center gap-2 group bg-gray-800 text-gray-100 dark:bg-gray-100 dark:text-gray-800"
        >
          <ArrowLeftFromLine className="w-4 h-4 group-hover:translate-x-2" />
          <span>Edit Business Categories</span>
        </Button>

        <Button
          onClick={next}
          variant="secondary"
          disabled={
            isSubmitted || !formData?.subscriptionPlan || !formData?.maxDevices
          }
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
  handleSubmit,
  isSubmitted,
}) => {
  const [errors, setErrors] = useState({});

  const back = () =>
    setIsOpen((prev) => ({
      ...prev,
      DeviceActivations: true,
      SocialMediaLink: false,
    }));

  // ✅ URL validation helper
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // ✅ Platform validation
  const validate = () => {
    const newErrors = {};

    const fields = ["insta", "facebook", "linkedin", "youtube"];

    fields.forEach((field) => {
      const value = String(formData?.[field] || "").trim();

      if (value) {
        // Must be valid URL
        if (!isValidUrl(value)) {
          newErrors[field] = "Invalid URL format";
          return;
        }

        // Platform-specific check
        if (field === "insta" && !value.includes("instagram.com")) {
          newErrors[field] = "Enter a valid Instagram link";
        }

        if (field === "facebook" && !value.includes("facebook.com")) {
          newErrors[field] = "Enter a valid Facebook link";
        }

        if (field === "linkedin" && !value.includes("linkedin.com")) {
          newErrors[field] = "Enter a valid LinkedIn link";
        }

        if (field === "youtube" && !value.includes("youtube.com")) {
          newErrors[field] = "Enter a valid YouTube link";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validate()) {
      setIsOpen((prev) => ({
        ...prev,
        SocialMediaLink: false,
        TermsConditions: true,
      }));
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        {/* Instagram */}
        <div>
          <Label className={errors.insta ? "text-red-500" : ""}>
            Instagram
          </Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            name="insta"
            value={formData?.insta || ""}
            onChange={setValue}
          />
          {errors.insta && (
            <p className="text-sm text-red-500 mt-1">{errors.insta}</p>
          )}
        </div>

        {/* Facebook */}
        <div>
          <Label className={errors.facebook ? "text-red-500" : ""}>
            Facebook
          </Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            name="facebook"
            value={formData?.facebook || ""}
            onChange={setValue}
          />
          {errors.facebook && (
            <p className="text-sm text-red-500 mt-1">{errors.facebook}</p>
          )}
        </div>

        {/* LinkedIn */}
        <div>
          <Label className={errors.linkedin ? "text-red-500" : ""}>
            LinkedIn
          </Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            name="linkedin"
            value={formData?.linkedin || ""}
            onChange={setValue}
          />
          {errors.linkedin && (
            <p className="text-sm text-red-500 mt-1">{errors.linkedin}</p>
          )}
        </div>

        {/* YouTube */}
        <div>
          <Label className={errors.youtube ? "text-red-500" : ""}>
            YouTube
          </Label>
          <Input
            className="bg-gray-100 dark:bg-gray-700 mt-1"
            name="youtube"
            value={formData?.youtube || ""}
            onChange={setValue}
          />
          {errors.youtube && (
            <p className="text-sm text-red-500 mt-1">{errors.youtube}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <Button onClick={back} disabled={isSubmitted} className="w-full">
          Back
        </Button>

        <Button onClick={next} disabled={isSubmitted} className="w-full">
          View Terms & Conditions
        </Button>
      </div>
    </>
  );
};

export const TermsConditions = ({
  setIsOpen,
  handleSubmit,
  isSubmitted,
  setFormData,
  formData,
}) => {
  const [agree, setAgree] = useState(false);

  const back = () =>
    setIsOpen((prev) => ({
      ...prev,
      SocialMediaLink: true,
      TermsConditions: false,
    }));

  const setAgreed = (value) => {
    const agreed = value === true;

    setFormData((prev) => ({
      ...prev,
      termsAccepted: agreed,
    }));

    setAgree(agreed);
  };

  // ✅ Full Validation
  const validateAll = () => {
    const errors = {};

    // Basic
    if (!String(formData.handlerName || "").trim())
      errors.handlerName = "Handler name is required";

    if (!formData.mobileNumbers?.length)
      errors.mobileNumbers = "Mobile number is required";

    if (!String(formData.email || "").trim())
      errors.email = "Email is required";

    // Business
    if (!String(formData.businessName || "").trim())
      errors.businessName = "Business name is required";

    if (!String(formData.businessLocation || "").trim())
      errors.businessLocation = "Business location is required";

    if (!String(formData.categories || "").trim())
      errors.categories = "Category is required";

    // Logo
    if (!formData.localFile && !formData.businessIcon)
      errors.businessIcon = "Business logo is required";

    // Device
    if (!formData.maxDevices)
      errors.maxDevices = "Device activation is required";

    return errors;
  };

  const next = () => {
    const errors = validateAll();

    // ❌ If validation fails
    if (Object.keys(errors).length > 0) {
      console.log("❌ Validation Errors:", errors);

      const firstError = Object.values(errors)[0];
      toast.error(firstError);

      return;
    }

    // ❌ Terms not accepted
    if (!agree) {
      toast.error("Please accept the terms and conditions to proceed.");
      return;
    }

    // ✅ Move to payment
    setIsOpen((prev) => ({
      ...prev,
      TermsConditions: false,
      Payments: true,
    }));
  };

  return (
    <Card className="mt-6 border border-gray-200 dark:border-gray-700 text-black dark:bg-gray-800 dark:text-white shadow-sm rounded-2xl overflow-hidden">
      {/* Header */}
      <CardHeader className="flex justify-between pb-4 border-b">
        <CardTitle>Bazar.sh Terms & Conditions</CardTitle>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-6 space-y-4 max-h-72 overflow-y-auto">
        {[
          "आपल्या व्यवसायाचे नाव, लोगो आणि दिलेली माहिती सार्वजनिकरित्या Bazar.sh वर प्रदर्शित केली जाईल.",
          "आपली वैयक्तिक माहिती कोणत्याही इतर कंपनी किंवा व्यक्तीकडे दिली जाणार नाही.",
          "Bazar.sh तपासणी, सुधारणा किंवा माहिती अपडेट साठी आपणास संपर्क करू शकतो।",
          "आपण दिलेल्या माहितीचा वापर Bazar.sh फक्त आपल्या व्यवसायाच्या प्रमोशनसाठीच करेल.",
          "अवैध/अश्लील सामग्री अपलोड केल्यास खाते हटवले जाईल.",
          "तांत्रिक अडचणीसाठी ७ ते १२ दिवस लागू शकतात.",
        ].map((term, index) => (
          <p key={index}>
            {index + 1}. {term}
          </p>
        ))}
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
        {/* Agreement Checkbox */}
        <div className="flex items-start sm:items-center space-x-3 w-full sm:w-auto p-3 bg-white/80 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
          <Checkbox
            id="agree"
            aria-label="Agree to terms and conditions"
            checked={agree}
            onCheckedChange={setAgreed}
            className="mt-0.5 data-[state=checked]:bg-blue-600 border-gray-300 dark:border-gray-500"
          />
          <label
            htmlFor="agree"
            className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer leading-relaxed"
          >
            मी वरील अटी व शर्ती मान्य करतो/करते.
          </label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            onClick={back}
            variant="outline"
            className="flex items-center justify-center gap-2 h-12 px-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 flex-1 sm:flex-none"
          >
            <ArrowLeftFromLine className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Edit Social Media</span>
          </Button>

          <Button
            onClick={next}
            disabled={!agree || isSubmitted}
            className="flex items-center justify-center gap-2 h-12 px-6 group bg-gray-800 text-gray-100 dark:bg-gray-100 dark:text-gray-800 font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
          >
            <span>Move to payment</span>
            <ArrowRightFromLine className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export const Payment = ({
  setIsOpen,
  handleSubmit,
  isSubmitted,
  setFormData,
  formData,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remark, setRemark] = useState("");
  const amount = 2000;

  const back = () =>
    setIsOpen((prev) => ({
      ...prev,
      TermsConditions: true,
      Payments: false,
    }));

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      console.log("🟡 Creating Razorpay order...");

      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) throw new Error("Failed to create order");
      const data = await response.json();
      console.log("✅ Razorpay order created:", data);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Bazar SH",
        description: "Website Plan Payment",
        order_id: data.id,
        handler: async function (response) {
          console.log("💰 Payment successful:", response);

          setFormData((prev) => ({
            ...prev,
            remark,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            paymentStatus: "success",
          }));

          // Show loader animation while submitting
          setIsSubmitting(true);
          await handleSubmit();
          setTimeout(() => {
            setIsSubmitting(false);
          }, 1000);
        },
        prefill: {
          name: formData?.name || "Chaitanya",
          email: formData?.email || "chaitanyasatarkar123@gmail.com",
          contact: formData?.phone || "1234567890",
        },
        notes: { address: "Bazar SH Office" },
        theme: {
          color: "#000000",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        console.error("❌ Payment failed:", response.error);
        alert("Payment failed. Please try again.");
      });
      razorpay.open();
    } catch (error) {
      console.error("❌ Payment Error:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isSubmitting && (
        <ProcessingModal />
        )}
      </AnimatePresence>

      <Card className="mt-6 border border-gray-300 dark:border-gray-700 text-black dark:text-white bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />

        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/60 to-gray-100/60 dark:from-gray-800/60 dark:to-gray-700/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-200 dark:bg-gray-800 rounded-xl">
              <CreditCard className="w-5 h-5 text-black dark:text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                Bazar.sh Payment
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Secure Payment Gateway
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="p-6 space-y-6 text-base text-gray-700 dark:text-gray-300">
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Amount
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{amount}
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="remark"
              className="text-gray-900 dark:text-gray-200 font-medium"
            >
              Remark (Optional)
            </Label>
            <Input
              id="remark"
              type="text"
              placeholder="Enter any note or remark before payment..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full p-7 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-gray-200 dark:border-gray-700 bg-gray-100/60 dark:bg-gray-900/40">
          <Button
            onClick={back}
            variant="outline"
            className="flex items-center justify-center gap-2 h-12 px-4 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:border-gray-500 dark:hover:border-gray-500 transition-all duration-200 flex-1 sm:flex-none"
          >
            <ArrowLeftFromLine className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Terms</span>
          </Button>

          <Button
            onClick={handlePayment}
            disabled={isProcessing || isSubmitted}
            className="flex items-center justify-center gap-2 h-12 px-6 group bg-black dark:bg-white text-white dark:text-black font-semibold shadow-md hover:shadow-lg hover:bg-gray-900 dark:hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
          >
            {isProcessing ? "Processing..." : `Pay ₹${amount}`}
            <CreditCard className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};





