import Image from "next/image";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const UserList = ({ users }) => {
  if (!users || users.length === 0) {
    return <p className="text-gray-500 text-center">No users found</p>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {users.map((user) => {
        const categoryName = user.categoryDetails?.[0]?.name || "No Category";

        const formattedDate = user.joiningDate
          ? new Date(user.joiningDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "N/A";

        return (
          <Card
            key={user._id}
            onClick={() => (window.location.href = `/user/${user._id}`)}
            className="flex flex-row items-center cursor-pointer hover:shadow-lg transition-all duration-200"
          >
            {/* Left: Image */}
            <div className="shrink-0 w-18 h-18 relative mx-1 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
              {user.businessIcon ? (
                <Image
                  src={user.businessIcon}
                  alt={user.businessName || "Business"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="flex items-center justify-center w-full h-full text-xl font-bold text-gray-600 dark:text-gray-300">
                  {(user.businessName || "A").charAt(0)}
                </span>
              )}
            </div>

            {/* Right: Details */}
            <CardContent className="flex flex-col justify-start overflow-hidden">
              <h2 className="text-md font-semibold text-gray-800 dark:text-gray-100 wrap-break-word">
                {user.businessName || "No Name"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm truncate ">
                {user.email || "No Email"}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm truncate wrap-break-word">
                {user.mobileNumber || "No Mobile"}
              </p>
              <p className="text-gray-700 dark:text-gray-200 text-sm font-medium  wrap-break-word">
                {categoryName}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs">
                Joined: {formattedDate}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UserList;
