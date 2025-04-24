import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: null,
    email: "",
    role: "",
    isAuthenticated: false,
  },
  reducers: {
    userLogin: (state, action) => {
        state.id = action.payload.id;
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.isAuthenticated = action.payload.isAuthenticated;
      },
      
    userLogout: (state) => {
      state.id = null;
      state.email = "";
      state.role = "";
      state.isAuthenticated = false;
    },
  },
});

export const { userLogin, userLogout } = userSlice.actions;
export default userSlice.reducer;
