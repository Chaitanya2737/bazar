import { combineReducers } from "@reduxjs/toolkit";
import userCreationSlice from "./slice/user/addUserSlice";
import themeSlice from "./slice/theme/themeSlice";
import userSlice from "./slice/user/userSlice";
import userData from "./slice/user/getuserData";
import previewData from "./slice/user/preview";

const rootreducer = combineReducers(
    {
        user :userCreationSlice,
        theme : themeSlice,
        userAuth: userSlice,
        userdata: userData,
        previewData: previewData
    }
)
export default rootreducer