import React from "react";
import Header from "../components/Header/Header";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

// ✅ Matches your real slices
const mockUserReducer = (state = { userData: null, userId: null }, action) =>
  state;
const mockWishlistReducer = (state = { items: [] }, action) => state;

const createStore = (preloadedState) =>
  configureStore({
    reducer: {
      user: mockUserReducer,
      wishlist: mockWishlistReducer,
    },
    preloadedState,
  });

const StoryWrapper = (storeState) => (Story) => (
  <Provider store={createStore(storeState)}>
    <BrowserRouter>
      <Story />
    </BrowserRouter>
  </Provider>
);

export default {
  title: "Components/Header",
  component: Header,
};

export const LoggedOut = () => {
  const storeState = {
    user: { userData: null, userId: null }, // ✅ fixed
    wishlist: { items: [] },
  };

  return StoryWrapper(storeState)(() => <Header />);
};

export const LoggedIn = () => {
  const storeState = {
    user: {
      userData: { name: "Antonio" }, // ✅ fixed
      userId: "66ec51a83ccad6e64d8deec4",
    },
    wishlist: { items: [1, 2] },
  };

  return StoryWrapper(storeState)(() => <Header />);
};
