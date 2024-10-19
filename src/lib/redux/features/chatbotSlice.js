import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false, // Initial state of the chatbot (closed)
  messages: [
    {
      text: "Hello! How can I assist you today? You can tell me the type of category and the dimensions, and I will find the furniture for you.",
    },
  ],
  scrollPosition: 0,
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    toggleChatbot: (state) => {
      state.isOpen = !state.isOpen;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    saveScrollPosition: (state, action) => {
      state.scrollPosition = action.payload;
    },
  },
});

export const { toggleChatbot, addMessage, saveScrollPosition } = chatbotSlice.actions;
export default chatbotSlice.reducer;
