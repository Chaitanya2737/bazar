import { createSlice } from "@reduxjs/toolkit";
import { getUserPreview } from "./serviceApi";

// userPreviewSlice.js (Redux slice)
const initialState = {
  userPreview: null,
  loading: false, 
  error:  false,
  errorMessage: null,
};

const userPreviewSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserPreview: (state) => {
      state.userPreview = null;
      state.loading = false;
      state.errorMessage = null;
    },
    loadFromStorage: (state, action) => {
      state.userPreview = action.payload; // Payload will be the data from localStorage
      state.loading = false;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserPreview.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserPreview.fulfilled, (state, action) => {
        state.userPreview = action.payload;
        state.loading = false;
      })
      .addCase(getUserPreview.rejected, (state, action) => {
        state.loading = false;
        state.error = true
        state.errorMessage = action.error.message;
      });
  },
});

export const { resetUserPreview, loadFromStorage } = userPreviewSlice.actions;

export default userPreviewSlice.reducer;
