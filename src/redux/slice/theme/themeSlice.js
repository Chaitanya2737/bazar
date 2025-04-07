import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage if available
const initialDarkMode =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("darkMode")) ?? false
    : false;

const initialState = {
  darkMode: initialDarkMode,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", JSON.stringify(action.payload));
      }
    },
  },
});

export const { setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
