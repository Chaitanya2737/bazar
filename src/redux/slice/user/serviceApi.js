import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createUserApi = createAsyncThunk(
  "user/createUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/createuser", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      return rejectWithValue(error.response?.data || "Unknown error");
    }
  }
);
