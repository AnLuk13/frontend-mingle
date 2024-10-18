import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import wishlistReducer from "./features/wishlistSlice";
import productsReducer from "./features/productsSlice";
import chatbotReducer from "./features/chatbotSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    wishlist: wishlistReducer,
    products: productsReducer,
    chatbot: chatbotReducer,
  },
});

export default store;
