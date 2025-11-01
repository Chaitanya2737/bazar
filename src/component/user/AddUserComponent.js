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
            SocialMediaLink: false,
            TermsConditions: false, // 🆕 Add this
          };
    }
    return {
      BasicCategories: true,
      BusinessCategories: false,
      SocialMediaLink: false,
      TermsConditions: false, // 🆕
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
        `/adduser/success/${encodeURIComponent(businessName)}/${status}`
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

  console.log(adminId);

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
  const back = () =>
    setIsOpen((prev) => ({
      ...prev,
      BusinessCategories: true,
      SocialMediaLink: false,
    }));

  const next = () =>
    setIsOpen((prev) => ({
      ...prev,
      SocialMediaLink: false,
      TermsConditions: true,
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
          disabled={isSubmitted}
          className="w-full flex items-center justify-center gap-2 group bg-gray-800 text-gray-100 dark:bg-gray-100 dark:text-gray-800"
        >
          <ArrowLeftFromLine className="w-4 h-4 group-hover:translate-x-2" />
          <span>Edit in Business Categories</span>
        </Button>

        <Button
          onClick={next}
          variant="secondary"
          disabled={isSubmitted} // Add disabled prop here
          className="w-full flex items-center justify-center gap-2 group bg-gray-800 text-gray-100 dark:bg-gray-100 dark:text-gray-800"
        >
          <span>View Terms & Conditions</span>
          <ArrowRightFromLine className="w-4 h-4 group-hover:translate-x-2" />
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
    setFormData((prev) => {
      const updated = { ...prev, termsAccepted: agreed };
      console.log("🟢 Updated formData:", updated);
      return updated;
    });
    setAgree(agreed);
  };

  const next = () => {
    if (!agree) {
      toast.error("Please accept the terms and conditions to proceed.");
      return; // prevent moving forward
    }

    setIsOpen((prev) => ({
      ...prev,
      TermsConditions: false,
      Payments: true,
    }));
  };

  return (
    <Card className="mt-6 border border-gray-200 dark:border-gray-700 text-black dark:bg-gray-800 dark:text-white shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-gray-900/50 dark:to-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              Bazar.sh Terms & Conditions
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Updated: Oct 2025
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-6 space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div className="space-y-3">
          {[
            "आपल्या व्यवसायाचे नाव, लोगो आणि दिलेली माहिती सार्वजनिकरित्या Bazar.sh वर प्रदर्शित केली जाईल.",
            "आपली वैयक्तिक माहिती कोणत्याही इतर कंपनी किंवा व्यक्तीकडे दिली जाणार नाही.",
            "Bazar.sh तपासणी, सुधारणा किंवा माहिती अपडेट साठी आपणास संपर्क करू शकतो।",
            "आपण दिलेल्या माहितीचा वापर Bazar.sh फक्त आपल्या व्यवसायाच्या प्रमोशनसाठीच करेल.",
            "जर कोणत्याही वापरकर्त्याने जाती, धर्म, लिंग, व्यक्ती किंवा समाजाविरुद्ध आक्षेपार्ह, अश्लील, भेदभाव करणारी किंवा कायद्याच्या विरोधात असलेली कोणतीही प्रतिमा, माहिती किंवा सामग्री अपलोड केली, तर त्याचे खाते तत्काळ हटविले जाईल, आवश्यक ती कायदेशीर कारवाई करण्यात येईल आणि अशा कृतीसाठी Bazar.sh कोणतीही जबाबदारी स्वीकारणार नाही.",
            "जर प्रोजेक्टमध्ये कोणतीही तांत्रिक अडचण किंवा त्रुटी निर्माण झाली, तर त्याच्या निराकरणासाठी वापरकर्त्याने ७ ते १२ दिवस संयम ठेवावा.",
          ].map((term, index) => (
            <div key={index} className="flex items-start gap-3 py-2">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                {index + 1}
              </span>
              <p className="flex-1 text-gray-700 dark:text-gray-300">{term}</p>
            </div>
          ))}
        </div>
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
  const amount = 100;

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-lg bg-gradient-to-br from-black/90 via-purple-900/20 to-blue-900/20 text-white"
    >
      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          rotate: [0, 180, 360],
        }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="absolute w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.2, 0.4],
          rotate: [180, 360, 180],
        }}
        transition={{ repeat: Infinity, duration: 5, ease: "linear", delay: 1 }}
        className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
      />

      {/* Main content container */}
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        className="relative z-10 flex flex-col items-center justify-center text-center max-w-md mx-4"
      >
        {/* Floating emoji with bounce */}
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
            rotate: { repeat: Infinity, duration: 3, ease: "easeInOut" }
          }}
          className="text-7xl mb-6 filter drop-shadow-2xl"
        >
          🚀
        </motion.div>

        {/* Progress indicator */}
        <div className="relative flex flex-col items-center gap-4 mb-8">
          {/* Outer glow ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute w-24 h-24 border-2 border-transparent border-t-white/30 border-r-white/10 rounded-full"
          />
          
          {/* Main spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full relative"
          >
            {/* Inner pulse */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-2 border-2 border-white/10 rounded-full"
            />
          </motion.div>

          {/* Progress dots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  delay: index * 0.2,
                }}
                className="w-2 h-2 bg-white/60 rounded-full"
              />
            ))}
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-3">
          {/* Main message */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            Processing Your Request
          </motion.h3>

          {/* Sub message */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-200 font-medium"
          >
            Securing your payment... ⏳
          </motion.p>

          {/* Animated status text */}
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-sm text-gray-300 space-y-1"
          >
            <p>✓ Payment verified</p>
            <p>✓ Data encrypted</p>
            <motion.p
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              🔄 Finalizing submission...
            </motion.p>
          </motion.div>

          {/* Funny reassurance */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-gray-400 italic pt-2 border-t border-white/10"
          >
            Dont worry, weve got this! Your data is safe with us 🔒
          </motion.p>
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 8, ease: "linear" }}
          className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-6 overflow-hidden"
        >
          <motion.div
            animate={{ x: [-100, 100] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="h-full w-20 bg-white/30 skew-x-12"
          />
        </motion.div>
      </motion.div>

      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: "0%",
            }}
          />
        ))}
      </div>

      {/* Close warning - only show after a few seconds */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5 }}
        className="absolute bottom-8 text-xs text-gray-400 text-center"
      >
        <p>Please keep this tab open until complete</p>
      </motion.div>
    </motion.div>
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
