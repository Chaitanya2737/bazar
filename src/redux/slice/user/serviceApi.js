import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createUserApi = createAsyncThunk(
  "user/createUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/createuser", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data , "error coming from createAsyncThunk in creation user ");
    }
  }
);
