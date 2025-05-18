import React, { useEffect, useRef, useState } from "react";
import "./ChatBot.css";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleChatbot,
  addMessage,
  saveScrollPosition,
} from "../../lib/redux/features/chatbotSlice";
import { selectChatBotState } from "../../lib/redux/features/sliceSelectors";
import { Link } from "react-router-dom";
import ChatBotIcon from "../Icons/ChatbotIcon";
import CloseBtn from "../Icons/CloseBtn";
import SendBtnIcon from "../Icons/SendBtnIcon";
import axios from "axios";

const ChatBot = () => {
  const chatBotState = useSelector(selectChatBotState);
  const dispatch = useDispatch();
  const chatContentRef = useRef(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Noua stare de încărcare

  useEffect(() => {
    const handleResize = () => {
      if (chatBotState.isOpen && window.innerWidth < 750) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    };
    handleResize(); // Verifică lățimea imediat ce componenta se încarcă sau se deschide chat-ul
    window.addEventListener("resize", handleResize); // Adaugă un listener pentru redimensionare
    return () => {
      document.body.style.overflow = "auto"; // Asigură overflow-ul corect la demontare
      window.removeEventListener("resize", handleResize); // Elimină listener-ul la demontare
    };
  }, [chatBotState.isOpen]);

  useEffect(() => {
    if (chatBotState.isOpen && chatContentRef.current) {
      chatContentRef.current.scrollTop = chatBotState.scrollPosition;
    }
  }, [chatBotState.isOpen, chatBotState.scrollPosition]);

  const handleScroll = () => {
    if (chatContentRef.current) {
      dispatch(saveScrollPosition(chatContentRef.current.scrollTop));
    }
  };

  const sendMessage = (message, id = null) => {
    dispatch(addMessage({ text: message, id }));
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage(`You: ${input}`);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/openAI`,
        {
          message: input,
        }
      );
      const { data } = response;

      setIsLoading(false);

      if (!data.success) {
        // Handle error cases with suggestions
        sendMessage(`Error: ${data.message}`);

        // Handle suggestion lists
        if (data.suggestions?.length > 0) {
          sendMessage("Try adjusting your search by:");
          data.suggestions.forEach((suggestion) => {
            sendMessage(`• ${suggestion}`);
          });
        }
      } else {
        // Handle successful product results
        if (data.products?.length > 0) {
          sendMessage(`Found ${data.count} matching products:`);

          data.products.forEach((product) => {
            const productDetails = [
              `• ${product.name}`,
              `  Brand: ${product.brand || "N/A"}`,
              `  Price: $${product.price.toFixed(2)}`,
              `  Stock: ${product.stock} units`,
              `  Desc: ${
                product.description
                  ? sliceDescription(product.description)
                  : "No description available"
              }`,
              product.discount ? "  🏷️ On Sale!" : null,
            ]
              .filter(Boolean) // Remove null/undefined entries
              .join("\n");

            sendMessage(productDetails, product._id);
          });
        } else {
          sendMessage("No products found matching your criteria.");
          sendMessage("Try broadening your search or using different terms.");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);

      if (error.response?.status === 400) {
        // Handle validation errors
        sendMessage("Please provide more specific details such as:");
        if (error.response.data.suggestions) {
          error.response.data.suggestions.forEach((suggestion) => {
            sendMessage(`• ${suggestion}`);
          });
        }
      } else if (error.response?.status === 404) {
        // Handle no results found
        sendMessage(error.response.data.message);
        if (error.response.data.suggestions) {
          sendMessage("Suggestions to improve your search:");
          error.response.data.suggestions.forEach((suggestion) => {
            sendMessage(`• ${suggestion}`);
          });
        }
      } else if (error.response?.status === 500) {
        // Handle server errors
        sendMessage("Sorry, there was a server error. Please try again later.");
      } else if (error.request) {
        // Handle network errors
        sendMessage(
          "Unable to connect to the server. Please check your internet connection."
        );
      } else {
        // Handle unexpected errors
        sendMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  const sliceDescription = (desc) => {
    return desc.length > 25 ? `${desc.slice(0, 25)}...` : desc;
  };

  return (
    <>
      {chatBotState.isOpen ? (
        <div className="chatBox">
          <div className="chatName">
            MinglerAI
            <button
              className="toggleChatBtn"
              onClick={() => dispatch(toggleChatbot())}
            >
              <CloseBtn color={"#fff"} />
            </button>
          </div>
          <div
            className="chatContent"
            ref={chatContentRef}
            onScroll={handleScroll}
          >
            {chatBotState.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatMessage ${
                  msg.text?.startsWith("You:")
                    ? "userMessage"
                    : "assistantMessage"
                }`}
              >
                {msg.id ? (
                  <Link
                    className="assistantMessageLink"
                    to={`/products/${msg.id}`}
                    onClick={() => dispatch(toggleChatbot())}
                  >
                    {msg.text}
                  </Link>
                ) : (
                  <span>{msg.text}</span>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="chatMessage assistantMessage">Loading...</div>
            )}
          </div>
          <div className="chatInputBox">
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", width: "100%" }}
            >
              <input
                className="chatInput"
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message..."
                style={{ width: "80%" }}
              />
              <button className="sendBtn" type="submit">
                <SendBtnIcon />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button className="closeBtn" onClick={() => dispatch(toggleChatbot())}>
          <ChatBotIcon />
        </button>
      )}
    </>
  );
};

export default ChatBot;
