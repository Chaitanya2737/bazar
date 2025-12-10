import Image from "next/image";
import React from "react";

const UserList = ({ users }) => {
  if (!users || users.length === 0) {
    return <p className="text-gray-500 text-center">No users found</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
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
          <div
            key={user._id}
            onClick={() => (window.location.href = `/user/${user._id}`)}
            className="flex items-center border border-gray-200 dark:border-gray-700 
                       rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm 
                       hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            {/* Left: Business Icon */}
            <div
              className="flex items-center justify-center w-24 h-24 
                            bg-gray-100 dark:bg-gray-900 
                            border-2 border-gray-200 dark:border-gray-700 
                            rounded-xl overflow-hidden relative shrink-0"
            >
              {user.businessIcon ? (
                <Image
                  src={user.businessIcon}
                  alt={user.businessName || "Business"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-gray-600 dark:text-gray-300">
                  {(user.businessName || "A").charAt(0)}
                </span>
              )}
            </div>

            <div className="border-l border-gray-300 dark:border-gray-700 mx-4"></div>

            {/* Right: User Details */}
            <div className="flex flex-col justify-center leading-relaxed space-y-1 overflow-hidden">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate w-48">
                {user.businessName}
              </h2>

              <p className="text-gray-600 dark:text-gray-300 text-sm truncate w-48">
                {user.email || "No Email"}
              </p>

              <p className="text-gray-700 dark:text-gray-300 text-sm truncate w-48">
                {user.mobileNumber || "No mobile number"}
              </p>

              <p className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                {categoryName}
              </p>

              <p className="text-gray-400 dark:text-gray-500 text-xs">
                Joined: {formattedDate}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
