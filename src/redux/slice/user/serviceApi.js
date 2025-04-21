import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createUserApi = createAsyncThunk(
  "user/createUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/createuser", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      // Check if the server returned an HTML page instead of JSON
      if (
        error.response &&
        error.response.data &&
        typeof error.response.data === "string" &&
        error.response.data.startsWith("<!DOCTYPE")
      ) {
        console.error("HTML Error page received:", error.response.data);
        return rejectWithValue("Received unexpected HTML error page.");
      }

      console.error("Error creating user:", error);

      // If response has JSON error
      return rejectWithValue(error.response?.data || "Unknown error occurred.");
    }
  }
);
