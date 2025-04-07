import { combineReducers } from "@reduxjs/toolkit";
import userCreationSlice from "./slice/user/userSlice";
import themeSlice from "./slice/theme/themeSlice";

const rootreducer = combineReducers(
    {
        user :userCreationSlice,
        theme : themeSlice
    }
)
export default rootreducer