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
    setIsLoading(true); // Activează mesajul "Loading..." când începe solicitarea

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/openAI`,
        { message: input },
      );
      const { data } = response;

      setIsLoading(false); // Dezactivează mesajul "Loading..." la primirea răspunsului

      if (data.message) {
        sendMessage(data.message);
      } else if (Array.isArray(data) && data.length > 0) {
        data.forEach((item) => {
          sendMessage(
            `- ${item.name}: ${sliceDescription(item.description)}. Price: $${
              item.price
            }. In stock: ${item.stock}`,
            item._id,
          );
        });
      } else {
        sendMessage("No matching products found.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false); // Dezactivează mesajul "Loading..." în caz de eroare
      sendMessage("An error occurred. Please try again.");
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
