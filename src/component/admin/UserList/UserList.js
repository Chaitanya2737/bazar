import Image from "next/image";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const UserList = ({ users, fetchUser }) => {
  const [openId, setOpenId] = useState(null);
  const [newName, setNewName] = useState("");

  if (!users || users.length === 0) {
    return <p className="text-gray-500 text-center">No users found</p>;
  }

  const changeName = async (id) => {
    try {
      const response = await axios.post("/api/admin/changename", {
        id,
        updatedName: newName,
      });

      setOpenId(null); // close dialog

      if (response.data.success) {
        fetchUser();
      } else {
        return toast.error("getting error");
      }
    } catch (error) {
      console.log("Error updating name:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
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
            className="cursor-pointer hover:shadow-lg transition-all duration-200 
  bg-white dark:bg-gray-800 text-black dark:text-white  
  flex flex-col justify-between"
          >
            {/* TOP SECTION */}
            <div className="p-3 grid grid-cols-[80px_1fr] gap-6 antialiased">
              {/* IMAGE */}
              <div
                className="relative w-full h-20 rounded-xl overflow-hidden border-2 
    border-gray-200 dark:border-gray-700"
              >
                {user.businessIcon ? (
                  <Image
                    src={user.businessIcon}
                    alt={user.businessName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-xl font-bold">
                    {user.businessName?.charAt(0) || "A"}
                  </span>
                )}
              </div>

              {/* DETAILS */}
              <CardContent className="flex flex-col justify-start p-0">
                <h2 className="text-md font-semibold text-gray-800 dark:text-gray-100 w-40 ">
                  {user.businessName}
                </h2>

                <p className="text-gray-600 dark:text-gray-300 text-sm truncate w-40">
                  {user.email}
                </p>

                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {user.mobileNumber}
                </p>

                <p className="text-gray-700 dark:text-gray-200 text-sm font-medium">
                  {categoryName}
                </p>

                <p className="text-gray-400 dark:text-gray-500 text-xs">
                  Joined: {formattedDate}
                </p>
              </CardContent>
            </div>

            {/* FULL WIDTH BUTTON AT BOTTOM */}
            <div className="p-3 pt-0">
              <Dialog
                open={openId === user._id}
                onOpenChange={(v) => !v && setOpenId(null)}
              >
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    onClick={() => setOpenId(user._id)}
                  >
                    Edit Name
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Business Name</DialogTitle>
                  </DialogHeader>

                  <Input
                    placeholder="Enter new name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />

                  <DialogFooter>
                    <Button
                      className="w-full"
                      onClick={() => changeName(user._id)}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default UserList;
