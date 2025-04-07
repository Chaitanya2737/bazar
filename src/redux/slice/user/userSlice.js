import { createSlice } from "@reduxjs/toolkit";
import { userAddingField } from "@/constant/helper";
import { createUserApi } from "./serviceApi";

// Try loading from localStorage
const savedUser = (() => {
  try {
    const data = localStorage.getItem("userFormData");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to parse userFormData from localStorage", error);
    return null;
  }
})();

const initialState = {
  user: savedUser || { ...userAddingField },
  isLoading: false,
  isError: false,
};

const userCreationSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.user = { ...userAddingField };
      state.isLoading = false;
      state.isError = false;

      // Remove from localStorage
      localStorage.removeItem("userFormData");
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };

      // Save to localStorage
      localStorage.setItem("userFormData", JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUserApi.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createUserApi.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;

        // Save to localStorage
        localStorage.setItem("userFormData", JSON.stringify(action.payload));
      })
      .addCase(createUserApi.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { resetUser, updateUser } = userCreationSlice.actions;
export default userCreationSlice.reducer;
