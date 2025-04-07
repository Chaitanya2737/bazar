const { configureStore } = require("@reduxjs/toolkit");
import rootreducer from "./rootReducer";


const store = configureStore({
    reducer:rootreducer
})
export default store