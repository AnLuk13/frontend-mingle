import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false, // Initial state of the chatbot (closed)
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    toggleChatbot: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});
export const { toggleChatbot } = chatbotSlice.actions;
export default chatbotSlice.reducer;
