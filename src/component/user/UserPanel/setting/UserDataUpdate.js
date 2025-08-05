"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Image from "next/image";
import { userLogin } from "@/redux/slice/user/userSlice";
import { getUserDataApi } from "@/redux/slice/user/serviceApi";
import ChangePassword from "./ChangePassword";

const UserDataUpdate = () => {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState({
    BasicCategories: true,
    BusinessCategories: true,
    SocialMediaLink: false,
  });

  const [showFullBio, setShowFullBio] = useState(false);

  const userAuth = useSelector((state) => state.userAuth, shallowEqual);
  const userdata = useSelector((state) => state.userdata, shallowEqual);
  const userData = userdata?.userData;

  const userId = useMemo(
    () => userAuth?.id || userData?._id || session?.user?.id,
    [userAuth, userData, session]
  );

  useEffect(() => {
    if (session?.user && !userAuth?.id) {
      const { id, email, role, isAuthenticated } = session.user;
      dispatch(userLogin({ id, email, role, isAuthenticated }));
    }
  }, [session, dispatch, userAuth?.id]);

  useEffect(() => {
    if (session?.user && !userData) {
      dispatch(getUserDataApi(userId)).unwrap().catch((err) => {
        console.error("User Data Fetch Error:", err);
      });
    }
  }, [session, dispatch, userId, userData]);

  if (!userData) return <div className="text-center mt-10">Data is loading...</div>;

  const {
    businessIcon,
    bio,
    businessName,
    handlerName,
    mobileNumber,
    email,
    gstNumber,
    admin,
    termsAccepted,
    joiningDate,
    socialMediaLinks,
  } = userData;

  const words = bio?.split(" ") || [];
  const isLongBio = words.length > 50;
  const shortBio = isLongBio ? words.slice(0, 30).join(" ") + "..." : bio;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4 my-6 border-b pb-6">
        <Image
          src={businessIcon}
          alt="Business Icon"
          width={150}
          height={150}
          className="rounded-xl"
        />
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          {businessName || "Business Name Not Provided"}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="border p-6 rounded-2xl shadow-sm bg-white dark:bg-gray-800 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Basic Information
          </h2>

          {isOpen.BasicCategories && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Handler Name</p>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {handlerName}
                </h3>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Mobile Numbers</p>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                  {mobileNumber.map((number, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 shadow-sm"
                    >
                      <p className="text-gray-700 dark:text-gray-100">{number}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {email}
                </h3>
              </div>
            </div>
          )}
        </div>

        {/* Business Information */}
        <div className="border p-6 rounded-2xl shadow-sm bg-white dark:bg-gray-800 space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Business Information
            </h2>
            <button
              onClick={() =>
                setIsOpen((prev) => ({
                  ...prev,
                  BusinessCategories: !prev.BusinessCategories,
                }))
              }
              className="text-sm text-blue-500 hover:underline"
            >
              {isOpen.BusinessCategories ? "Hide" : "Show"}
            </button>
          </div>

          {isOpen.BusinessCategories && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Business Name</p>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                  {businessName || <span className="text-gray-400">Not Provided</span>}
                </p>
              </div>

              {bio && (
                <div>
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="text-base text-gray-700 dark:text-gray-200 leading-relaxed">
                    {showFullBio ? bio : shortBio}
                    {isLongBio && (
                      <button
                        onClick={() => setShowFullBio(!showFullBio)}
                        className="ml-2 text-blue-500 text-sm hover:underline"
                      >
                        {showFullBio ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </p>
                </div>
              )}

              <Info label="Admin Id" value={admin || "Not Assigned"} />
              <Info label="GST Number" value={gstNumber || "Not Provided"} />
              <Info
                label="Terms & Conditions"
                value={termsAccepted ? "Accepted" : "Not Accepted"}
              />
              <Info
                label="Joining Date"
                value={
                  joiningDate
                    ? new Date(joiningDate).toLocaleDateString()
                    : "Not Available"
                }
              />
            </div>
          )}
        </div>

        {/* Social Media */}
        <div className="border p-6 rounded-2xl shadow-sm bg-white dark:bg-gray-800 space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Social Media Accounts
            </h2>
            <button
              onClick={() =>
                setIsOpen((prev) => ({
                  ...prev,
                  SocialMediaLink: !prev.SocialMediaLink,
                }))
              }
              className="text-sm text-blue-500 hover:underline"
            >
              {isOpen.SocialMediaLink ? "Hide" : "Show"}
            </button>
          </div>

          {isOpen.SocialMediaLink && (
            <div className="mt-4 space-y-2">
              {renderSocialLink("Instagram", socialMediaLinks?.insta)}
              {renderSocialLink("Facebook", socialMediaLinks?.facebook)}
              {renderSocialLink("LinkedIn", socialMediaLinks?.linkedin)}
              {renderSocialLink("X (Twitter)", socialMediaLinks?.x)}
              {renderSocialLink("YouTube", socialMediaLinks?.youtube)}
            </div>
          )}
        </div>

        <ChangePassword />
      </div>
    </div>
  );
};

// Reusable subcomponents
const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-gray-700 dark:text-gray-200">{value}</p>
  </div>
);

const renderSocialLink = (platform, url) => {
  if (!url) return null;
  return (
    <div>
      <p className="text-sm text-gray-500">{platform}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {url}
      </a>
    </div>
  );
};

export default UserDataUpdate;
