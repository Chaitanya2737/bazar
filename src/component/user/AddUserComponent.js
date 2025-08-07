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
} from "lucide-react";
import { resetUser, updateUser } from "@/redux/slice/user/addUserSlice";
import { createUserApi } from "@/redux/slice/user/serviceApi";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
// Parent Component
const AddUserComponent = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.user);
  const [formData, setFormData] = useState(userAddingField);
  const [localFile, setLocalFile] = useState(null);
  const [submitError, setSubmitError] = useState(null); // For user feedback

  const navigation = useRouter();

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
    if (name === "businessIcon") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleSubmit = async () => {
    try {
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
      toast.success(`User "${businessName}" created successfully!`);

      // 7. Reset UI state
      setIsOpen({
        BasicCategories: true,
        BusinessCategories: false,
        SocialMediaLink: false,
      });

      // 8. Navigate to success page
      navigation.push(
        `/adduser/success/${encodeURIComponent(businessName)}/${status}`
      );
    } catch (error) {
      // 9. Show friendly error message
      const message =
        typeof error?.message === "string"
          ? error.message
          : "Something went wrong.";
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
}) => {
  const [errors, setErrors] = useState({});

  const [categorie, setCategorie] = useState([]);
  const { id } = useParams();
  const [adminId, setAdminId] = useState(id || "");

  console.log(categorie);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = () => {
    if (validate()) {
      console.log("next working");
      setIsOpen((prev) => ({ ...prev, SocialMediaLink: true }));
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/categorie/preview"
      );
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

        <CategoryPicker
          formData={formData}
          setValue={setValue}
          categorie={categorie}
          errors={errors}
        />

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
}) => {
  const back = () =>
    setIsOpen((prev) => ({
      ...prev,
      BusinessCategories: true,
      SocialMediaLink: false,
    }));

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
          onClick={handleSubmit}
          variant="secondary"
          className="w-full flex items-center justify-center gap-2 group bg-gray-800 text-gray-100 dark:bg-gray-100 dark:text-gray-800"
        >
          <span>Submit</span>
          <ArrowRightFromLine className="w-4 h-4 group-hover:translate-x-2" />
        </Button>
      </div>
    </>
  );
};

export function CategoryPicker({ formData, setValue, categorie, errors }) {
  const [open, setOpen] = useState(false);

  // helper to show selected label
  const selected = categorie.find((c) => c._id === formData.categories);

  return (
    <div>
      <Label
        className={errors?.categories ? "text-red-500" : ""}
        htmlFor="categories"
      >
        Categories
      </Label>

      {/* Desktop: keep your custom Select (if you have it), hidden on mobile */}
      {/* If you don't have a custom desktop select, remove this section */}
      <div className="hidden md:block">
        {/* Leave your existing desktop Select here or keep a native select for desktop */}
        <select
          id="categories-desktop"
          name="categories"
          value={formData.categories || ""}
          onChange={setValue}
          className="w-full mt-1 p-2 rounded bg-white dark:bg-gray-700 text-black dark:text-white border"
        >
          <option value="">-- Select category --</option>
          {categorie.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile trigger (looks like an input/select) */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full mt-1 p-3 text-left rounded bg-white dark:bg-gray-700 border"
        >
          {selected?.name ?? "-- Select category --"}
        </button>
      </div>

      {/* Mobile bottom-sheet */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* sheet */}
          <div
            className="relative w-full max-h-[70vh] overflow-auto bg-white dark:bg-gray-800 rounded-t-xl p-4"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex items-center justify-between mb-3">
              <strong>Select category</strong>
              <button
                onClick={() => setOpen(false)}
                className="text-sm px-2 py-1"
              >
                Close
              </button>
            </div>

            <ul>
              {categorie.map((item) => (
                <li key={item._id}>
                  <button
                    type="button"
                    onClick={() => {
                      setValue({
                        target: { name: "categories", value: item._id },
                      });
                      setOpen(false);
                    }}
                    className="w-full text-left py-3 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* error message */}
      {errors?.categories && (
        <p className="text-sm text-red-500 mt-1">{errors.categories}</p>
      )}
    </div>
  );
}
