import { combineReducers } from "@reduxjs/toolkit";
import userCreationSlice from "./slice/user/addUserSlice";
import themeSlice from "./slice/theme/themeSlice";
import userSlice from "./slice/user/userSlice";
import userData from "./slice/user/getuserData";

const rootreducer = combineReducers(
    {
        user :userCreationSlice,
        theme : themeSlice,
        userAuth: userSlice,
        userdata: userData
    }
)
export default rootreducer