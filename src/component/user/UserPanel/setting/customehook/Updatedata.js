"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUserDataApi } from "@/redux/slice/user/serviceApi";

const Updatedata = ({
  placeholder,
  userID,
  fieldKey,       // e.g. "businessName", "email", "mobileNumber", "bio"
  fieldValue,     // the current value (string)
  mobileIndex,    // only for mobileNumber array
  Title,
  onSave,
}) => {
  const [value, setValue] = useState(fieldValue || "");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const handleSave = async () => {
    if (!fieldKey) return;

    setLoading(true);
    try {
      let payload = { userId: userID };

      if (fieldKey === "mobileNumber" && mobileIndex !== undefined) {
        payload.mobileIndex = mobileIndex;
        payload.newMobile = value;
      } else {
        payload[fieldKey] = value;
      }

      console.log("📤 Sending payload:", payload);

      await axios.patch("/api/user/edit", payload);

      dispatch(getUserDataApi(userID)).unwrap().catch(console.error);

      setOpen(false);
      await onSave?.(fieldKey, value, userID);
    } catch (err) {
      console.error("❌ Update failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-dashed border-gray-400"
        >
          <Pencil className="w-4 h-4 text-gray-500" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {Title || `Update ${fieldKey}`}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-3">
          {fieldKey === "bio" ? (
            <textarea
              placeholder={placeholder || fieldValue}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full h-32 p-2 border rounded-md focus-visible:ring-1 focus-visible:ring-blue-500 resize-none"
            />
          ) : (
            <Input
              type="text"
              placeholder={placeholder || fieldValue}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={!value || loading}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Saving...
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Updatedata;
