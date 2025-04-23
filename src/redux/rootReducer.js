import { combineReducers } from "@reduxjs/toolkit";
import userCreationSlice from "./slice/user/addUserSlice";
import themeSlice from "./slice/theme/themeSlice";
import userSlice from "./slice/user/userSlice";

const rootreducer = combineReducers(
    {
        user :userCreationSlice,
        theme : themeSlice,
        userAuth: userSlice,
    }
)
export default rootreducer