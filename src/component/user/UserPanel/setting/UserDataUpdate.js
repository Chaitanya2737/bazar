"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Image from "next/image";
import { userLogin } from "@/redux/slice/user/userSlice";
import { getUserDataApi } from "@/redux/slice/user/serviceApi";
import ChangePassword from "./ChangePassword";
import Link from "next/link";
import Updatedata from "./customehook/Updatedata";
import { motion, AnimatePresence } from "framer-motion";

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
      dispatch(getUserDataApi(userId)).unwrap().catch(console.error);
    }
  }, [session, dispatch, userId, userData]);

  if (!userData)
    return <div className="text-center mt-10">Data is loading...</div>;

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
    slug,
  } = userData;

  const words = bio?.split(" ") || [];
  const isLongBio = words.length > 50;
  const shortBio = isLongBio ? words.slice(0, 30).join(" ") + "..." : bio;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4 my-6">
        <Image
          src={businessIcon}
          alt="Business Icon"
          width={120}
          height={120}
          className="rounded-2xl shadow-md"
        />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {businessName || "Business Name Not Provided"}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card
          title="Basic Information"
          open={isOpen.BasicCategories}
          onToggle={() =>
            setIsOpen((prev) => ({
              ...prev,
              BasicCategories: !prev.BasicCategories,
            }))
          }
        >
   
            <InfoRow label="Handler Name" value={handlerName}>
              <Updatedata
                userID={userId}
                fieldKey="handlerName"
                fieldValue={handlerName}
                Title="Update handler name"
              />
            </InfoRow>
       
          <InfoRow label="Mobile Numbers">
            <div className="flex flex-col gap-2 w-full">
              {mobileNumber.map((num, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700"
                >
                  <p className="text-gray-800 dark:text-gray-200">{num}</p>
                  <Updatedata
                    userID={userId}
                    fieldKey="mobileNumber" // tell component what field
                    fieldValue={num} // pass the single number
                    mobileIndex={idx} // which index in array
                    Title={`Update Mobile #${idx + 1}`}
                  />
                </div>
              ))}
            </div>
          </InfoRow>

          <InfoRow label="Email" value={email}>
            <Updatedata
              userID={userId}
              fieldKey="email"
              fieldValue={email}
              Title="Update email"
            />
          </InfoRow>

          <InfoRow label="Website">
            <Link
              href={`/${slug}`}
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              {"https://www.bazar.sh/" + slug}
            </Link>
            <Updatedata
              userID={userId}
              fieldKey="slug"
              fieldValue={slug}
              Title="Update domain name"
            />
          </InfoRow>
        </Card>

        {/* Business Info */}
        <Card
          title="Business Information"
          open={isOpen.BusinessCategories}
          onToggle={() =>
            setIsOpen((prev) => ({
              ...prev,
              BusinessCategories: !prev.BusinessCategories,
            }))
          }
        >
          <InfoRow
            label="Business Name"
            value={businessName || "Not Provided"}
          />

          {bio && (
            <InfoRow label="Bio">
              <p className="text-gray-700 dark:text-gray-200">
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
              <Updatedata
                userID={userId}
                fieldKey="bio"
                fieldValue={bio}
                Title="Update bio"
              />
            </InfoRow>
          )}

          <InfoRow label="Admin Id" value={admin || "Not Assigned"} />
          <InfoRow label="GST Number" value={gstNumber || "Not Provided"}>
            <Updatedata
              userID={userId}
              fieldKey="gstNumber"
              fieldValue={gstNumber}
              Title="Update GST"
            />
          </InfoRow>

          <InfoRow
            label="Terms & Conditions"
            value={termsAccepted ? "Accepted" : "Not Accepted"}
          />
          <InfoRow
            label="Joining Date"
            value={
              joiningDate
                ? new Date(joiningDate).toLocaleDateString()
                : "Not Available"
            }
          />
        </Card>

        {/* Social Media */}
        <Card
          title="Social Media Accounts"
          open={isOpen.SocialMediaLink}
          onToggle={() =>
            setIsOpen((prev) => ({
              ...prev,
              SocialMediaLink: !prev.SocialMediaLink,
            }))
          }
        >
          {renderSocialLink("Instagram", socialMediaLinks?.insta)}
          {renderSocialLink("Facebook", socialMediaLinks?.facebook)}
          {renderSocialLink("LinkedIn", socialMediaLinks?.linkedin)}
          {renderSocialLink("X (Twitter)", socialMediaLinks?.x)}
          {renderSocialLink("YouTube", socialMediaLinks?.youtube)}
        </Card>

        <ChangePassword />
      </div>
    </div>
  );
};

/* ✅ Reusable Components */

const Card = ({ title, children, open, onToggle }) => (
  <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm p-6">
    <div className="flex justify-between items-center border-b pb-3 mb-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>
      <button
        onClick={onToggle}
        className="text-sm text-blue-500 hover:underline"
      >
        {open ? "Hide" : "Show"}
      </button>
    </div>
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-5"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
const InfoRow = ({ label, value, children }) => (
  <div>
    {" "}
    <p className="text-sm text-gray-500">{label}</p>{" "}
    <div className="flex justify-between items-center gap-2">
      {" "}
      {value ? (
        <p className="text-gray-800 dark:text-gray-200">{value}</p>
      ) : (
        <p className="text-gray-400"></p>
      )}{" "}
      {children}{" "}
    </div>{" "}
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
        className="text-blue-600 hover:underline break-words"
      >
        {url}
      </a>
    </div>
  );
};

export default UserDataUpdate;
