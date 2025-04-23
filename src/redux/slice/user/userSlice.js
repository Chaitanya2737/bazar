const { createSlice } = require("@reduxjs/toolkit");

const userSlice = createSlice({
    name:"user",
    initialState:{
        id:null,
        email:"",
        role:""
    },
    reducers : {
        userLogin :(state , action) => {
            state.user = action.payload
        },
        userLogout :(state , action) => {
            state.user = null
        }
    }
})
export const {userLogin ,userLogout} = userSlice.actions
export default userSlice.reducer