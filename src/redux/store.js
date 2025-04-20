const { configureStore } = require("@reduxjs/toolkit");
import rootreducer from "./rootReducer";

const store = configureStore({
  reducer: rootreducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 👈 disables warning
    }),
});
export default store;
