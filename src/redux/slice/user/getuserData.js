const { createSlice } = require("@reduxjs/toolkit");
const { getUserDataApi } = require("./serviceApi");

const userData =createSlice({ 
    initialState: {
        userData: null,
        loading: false,
        error: false,
    },
    name: "userData",
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

export default userData.reducer;


