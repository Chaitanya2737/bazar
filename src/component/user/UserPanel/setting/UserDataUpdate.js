"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { userLogin } from "@/redux/slice/user/userSlice";
import { getUserDataApi } from "@/redux/slice/user/serviceApi";
import Updatedata from "./customehook/Updatedata";
import ChangePassword from "./ChangePassword";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "recharts";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner";

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

  const bioWords = bio?.split(" ") || [];
  const isLongBio = bioWords.length > 50;
  const shortBio = isLongBio ? bioWords.slice(0, 50).join(" ") + "..." : bio;

  const socialPlatforms = [
    ["insta", socialMediaLinks?.insta],
    ["facebook", socialMediaLinks?.facebook],
    ["linkedin", socialMediaLinks?.linkedin],
    ["x", socialMediaLinks?.x],
    ["youtube", socialMediaLinks?.youtube],
  ];

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
                    fieldKey="mobileNumber"
                    fieldValue={num}
                    mobileIndex={idx}
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
          {/* <InfoRow
            label="Business Name"
            value={businessName || "Not Provided"}
          /> */}

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
          {socialPlatforms.map(([platform, url]) => (
            <SocialMediaItem
              key={platform}
              platform={platform}
              url={url}
              id={userId}
            />
          ))}
        </Card>

        {/* Change Password */}
        <ChangePassword />
      </div>
    </div>
  );
};

/* Reusable Components */

const Card = ({ title, children, open, onToggle, id }) => (
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
  <div className="mb-3">
    <p className="text-sm text-gray-500">{label}</p>
    <div className="flex justify-between items-center gap-2">
      <p
        className={
          value ? "text-gray-800 dark:text-gray-200" : "text-gray-400 italic"
        }
      >
        {value}
      </p>
      {children}
    </div>
  </div>
);

const renderSocialLink = (platform, url) => (
  <div className="max-w-full">
    <p className="text-sm text-gray-500">{platform}</p>
    {url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline break-all max-w-full"
      >
        {url}
      </a>
    ) : (
      <span className="text-gray-400">Not added</span>
    )}
  </div>
);

const SocialMediaItem = ({ platform, url, id }) =>
  url ? (
    <div className="flex justify-between items-center gap-4 mb-3">
      {renderSocialLink(platform, url)}
      <SocialMediaDelete id={id} platform={platform} />
    </div>
  ) : (
    <div className="flex  justify-between items-center gap-4 mb-3">
      {renderSocialLink(platform)} {/* only label, no URL */}
      <SocialMediaAdd id={id} platform={platform} />
    </div>
  );

const SocialMediaDelete = ({ id, platform }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const fetchData = await axios.delete("/api/user/edit/socialmedia", {
        data: { id, platform },
      });

      toast.success(`${platform} link deleted successfully!`);

      // Refresh user data
      dispatch(getUserDataApi(id)).unwrap().catch(console.error);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete social media link");
    }
  };

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete}>
      Delete
    </Button>
  );
};

const SocialMediaAdd = ({ id, platform }) => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [addValue, setAddValue] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    const fetchData = await axios.post("/api/user/edit/socialmedia", {
      addValue,
      id,
      platform,
    });

    toast.success("Social media link added successfully!");

    setOpen(false);
    dispatch(getUserDataApi(id)).unwrap().catch(console.error);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Social Media</DialogTitle>
            <DialogDescription>
              Add a new social media link for your profile here. Click save when
              done.
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4" onSubmit={(e) => handleAdd(e)}>
            <div className="grid gap-3">
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                name="platform"
                onChange={(e) => setAddValue(e.target.value)}
                value={addValue}
                required
                placeholder="Instagram, Facebook..."
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDataUpdate;
