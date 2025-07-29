import React, { useState } from "react";
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
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const UserProduct = () => {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    thumbnail: null,
  });

  const selector = useSelector((state) => state.userAuth);
  const user = useSelector((state) => state.userdata?.userData);
  const [open, setOpen] = useState(false); // Controls Dialog open state

  const id = user?._id || selector?._id;
  const businessName = user?.businessName || "default-business";
  const isLogedIn = useSelector((state) => state.userAuth.isAuthenticated);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("Image size should not exceed 5MB.");
      return;
    }

    setProduct((prev) => ({ ...prev, thumbnail: file }));
  };

  const handleSubmit = async () => {
    if (!product.title || !product.thumbnail) {
      toast.error("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("thumbnail", product.thumbnail);
    formData.append("userId", id);
    formData.append("businessName", businessName);

    try {
      if (!isLogedIn) {
        toast.error("You must be logged in to upload a product.");
        return;
      }

      const res = await axios.post("/api/user/product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { success, message } = res.data;

      if (!success) {
        toast.error(message || "Upload failed.");
      } else {
        toast.success("Product uploaded successfully!");
        setProduct({ title: "", description: "", thumbnail: null });

        // ✅ Close dialog
        setOpen(false);
      }
    } catch (err) {
      console.error("Upload error:", err);

      if (err.response) {
        toast.error(
          err.response.data?.message || "Server responded with error"
        );
      } else if (err.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Product</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Product</DialogTitle>
        </DialogHeader>

        <Input
          type="file"
          className={"w-full h-30"}
          accept="image/*"
          onChange={handleFileChange}
        />
        <Input
          type="text"
          name="title"
          placeholder="Enter Product Title"
          onChange={handleOnChange}
        />
        <Input
          type="text"
          name="description"
          placeholder="Enter Product Description"
          onChange={handleOnChange}
        />

        <DialogFooter>
          <Button onClick={handleSubmit}>Add Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProduct;
