"use client";
import { useState } from "react";
import { addUserApi } from "@/service/apiservice";
import { FaChevronDown, FaChevronUp, FaPlus, FaTrash } from "react-icons/fa";

const AddUser = () => {
  const [userData, setUserData] = useState({
    businessName: "",
    handlerName: "",
    mobileNumber: [""],
    email: "",
    password: "Default@123",
    admin: "",
    businessIcon: null,
    categories: "",
  });

  const [openDropdown, setOpenDropdown] = useState("basicInfo");
  const [preview, setPreview] = useState(null);

  const onChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleMobileNumberChange = (e, index) => {
    const updatedNumbers = [...userData.mobileNumber];
    updatedNumbers[index] = e.target.value;
    setUserData({ ...userData, mobileNumber: updatedNumbers });
  };

  const addMobileField = () => {
    setUserData({ ...userData, mobileNumber: [...userData.mobileNumber, ""] });
  };

  const removeMobileField = (index) => {
    const updatedNumbers = [...userData.mobileNumber];
    updatedNumbers.splice(index, 1);
    setUserData({ ...userData, mobileNumber: updatedNumbers });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUserData({ ...userData, businessIcon: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (key === "mobileNumber") {
        value.forEach((num, index) => formData.append(`mobileNumber[${index}]`, num));
      } else if (key === "businessIcon" && value) {
        formData.append("businessIcon", value);
      } else {
        formData.append(key, value);
      }
    });

    try {
      await addUserApi(formData);
      alert("User added successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add user.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 border rounded-lg shadow-lg bg-white max-w-3xl mx-auto">
      {/* Basic Info Section */}
      <div className="p-4 border rounded mt-2 bg-gray-100">
        <h2
          className="text-lg font-semibold flex justify-between cursor-pointer"
          onClick={() => setOpenDropdown("basicInfo")}
        >
          Basic Information {openDropdown === "basicInfo" ? <FaChevronUp /> : <FaChevronDown />}
        </h2>

        {openDropdown === "basicInfo" && (
          <>
            <label className="block mt-2 bg-black">Business Name</label>
            <input
              className="border p-2 rounded w-full"
              type="text"
              name="businessName"
              value={userData.businessName}
              onChange={onChange}
              placeholder="Business Name"
              required
            />
            <label className="block bg-black mt-2">Owner Name</label>
            <input
              className="border p-2 rounded w-full"
              type="text"
              name="handlerName"
              value={userData.handlerName}
              onChange={onChange}
              placeholder="Owner Name"
              required
            />
          </>
        )}
      </div>

      {/* Contact Details Section */}
      <div className="p-4 border rounded mt-2 bg-gray-100">
        <h2
          className="text-lg font-semibold flex justify-between cursor-pointer"
          onClick={() => setOpenDropdown("contactDetails")}
        >
          Contact Details {openDropdown === "contactDetails" ? <FaChevronUp /> : <FaChevronDown />}
        </h2>

        {openDropdown === "contactDetails" && (
          <>
            <label className="block mt-2">Email</label>
            <input
              className="border p-2 bg-black rounded w-full"
              type="email"
              name="email"
              value={userData.email}
              onChange={onChange}
              placeholder="Email"
              required
            />

            <label className="block mt-2">Mobile Number(s)</label>
            {userData.mobileNumber.map((num, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  className="border p-2 bg-black rounded w-full"
                  type="text"
                  placeholder={`Mobile ${index + 1}`}
                  value={num}
                  onChange={(e) => handleMobileNumberChange(e, index)}
                />
                {userData.mobileNumber.length > 1 && (
                  <button
                    type="button"
                    className="p-2 text-red-500"
                    onClick={() => removeMobileField(index)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            {userData.mobileNumber.length < 4 && (
              <button type="button" className="mt-2 text-blue-600 flex items-center gap-1" onClick={addMobileField}>
                <FaPlus /> Add Mobile Number
              </button>
            )}
          </>
        )}
      </div>

      {/* Additional Details Section */}
      <div className="p-4 border rounded mt-2 bg-gray-100">
        <h2
          className="text-lg font-semibold flex justify-between cursor-pointer"
          onClick={() => setOpenDropdown("additionalDetails")}
        >
          Additional Details {openDropdown === "additionalDetails" ? <FaChevronUp /> : <FaChevronDown />}
        </h2>

        {openDropdown === "additionalDetails" && (
          <>
            <label className="block bg-black mt-2">Admin Name</label>
            <input
              className="border p-2 rounded w-full"
              type="text"
              name="admin"
              value={userData.admin}
              onChange={onChange}
              placeholder="Admin Name"
              required
            />

            <label className="block bg-black mt-2">Categories</label>
            <input
              className="border p-2 rounded w-full"
              type="text"
              name="categories"
              value={userData.categories}
              onChange={onChange}
              placeholder="Categories"
            />

            <label className="block bg-black mt-2">Business Icon</label>
            <input type="file" className="border p-2 rounded w-full" onChange={handleFileChange} accept="image/*" />
            {preview && <img src={preview} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded" />}
          </>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full">
        Add User
      </button>
    </form>
  );
};

export default AddUser;
