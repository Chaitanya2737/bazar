import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createUserApi = createAsyncThunk(
  "user/createuser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/createuser", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      // Network error handling
      if (!error.response) {
        console.error("Network error:", error);
        return rejectWithValue("Network error occurred.");
      }

      // Check if the server returned an HTML page instead of JSON
      if (
        error.response.headers["content-type"]?.includes("text/html")
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
