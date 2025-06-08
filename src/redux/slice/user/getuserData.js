import { createSlice } from "@reduxjs/toolkit";
import { getUserDataApi } from "./serviceApi";

const userData = createSlice({
  name: "userData",
  initialState: {
    userData: null,
    loading: false,
    error: false,
  },
  reducers: {
    // Update the carousel images in the userData state
    updatedUsercarousel: (state, action) => {
      if (state.userData) {
        state.userData.carauselImages = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserDataApi.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getUserDataApi.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(getUserDataApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updatedUsercarousel } = userData.actions;
export default userData.reducer;
