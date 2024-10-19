import React, { useEffect, useState } from "react";
import "./ChatBot.css";
import { useDispatch, useSelector } from "react-redux";
import { selectProductsDetails } from "../../lib/redux/features/productsSlice";
import { toggleChatbot } from "../../lib/redux/features/chatbotSlice";
import { selectChatBotState } from "../../lib/redux/features/sliceSelectors";
import { Link } from "react-router-dom";
import ChatBotIcon from "../Icons/ChatbotIcon";
import CloseBtn from "../Icons/CloseBtn";
import SendBtnIcon from "../Icons/SendBtnIcon";

const ChatBot = () => {
  const products = useSelector(selectProductsDetails);
  const chatBotState = useSelector(selectChatBotState);
  const dispatch = useDispatch();

  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I assist you today? You can tell me the type of category and the dimensions, and I will find the furniture for you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("");
  // const [dimensions, setDimensions] = useState({
  //   length: 0,
  //   width: 0,
  //   height: 0,
  // });

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 150 && chatBotState.isOpen) {
  //       dispatch(toggleChatbot(false));
  //     }
  //   };
  //
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [chatBotState.isOpen, dispatch]);

  useEffect(() => {
    // Enable Virtual Keyboard overlay mode if supported
    if ("virtualKeyboard" in navigator) {
      navigator.virtualKeyboard.overlaysContent = true;

      // Listen for changes in the virtual keyboard's geometry
      navigator.virtualKeyboard.addEventListener("geometrychange", (event) => {
        const { height } = event.target.boundingRect;
        document.documentElement.style.setProperty(
            "--keyboard-height",
            `${height}px`
        );
      });
    }
  }, []);

  useEffect(() => {
    const chatContent = document.querySelector(".chatContent");
    if (chatContent) {
      chatContent.scrollTop = chatContent.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (message, id = null) => {
    setMessages((prev) => [...prev, { text: message, id }]); // Ensure every message has 'text' and optionally 'id'
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const sliceDescription = (desc) => {
    if (desc.length > 25) {
      return `${desc.slice(0, 25)}...`;
    } else return desc;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(`You: ${input}`);
    processUserInput(input);
    setInput("");
  };

  const processUserInput = (input) => {
    // Extract category if present (e.g., Furniture, Art, Outdoor Furniture)
    const categoryMatch = input.match(
      /(furniture|art|home decor|outdoor furniture|environment)/i,
    );

    // Extract dimensions (e.g., 5 4 3 or 5x4x3)
    const dimensionMatch = input.match(
      /(\d+\.?\d*)\s*x?\s*(\d+\.?\d*)\s*x?\s*(\d+\.?\d*)?/i,
    );

    if (categoryMatch) {
      setCategory(categoryMatch[0].toLowerCase());
    }

    if (dimensionMatch) {
      const length = parseFloat(dimensionMatch[1]) || 0;
      const width = parseFloat(dimensionMatch[2]) || 0;
      const height = parseFloat(dimensionMatch[3]) || 0;
      // setDimensions({ length, width, height });
      filterProducts(categoryMatch ? categoryMatch[0] : category, {
        length,
        width,
        height,
      });
    } else if (categoryMatch) {
      filterProducts(categoryMatch[0], { length: 0, width: 0, height: 0 });
    } else {
      sendMessage("Please specify a valid category or dimensions.");
    }
  };

  const filterProducts = (category, dimensions) => {
    const filteredProducts = products.items.filter((product) => {
      const productDimensions = product.dimensions || {};

      // Comparison logic: filter by category and check dimensions
      const matchesCategory =
        !category || product.category.toLowerCase() === category.toLowerCase();
      const matchesDimensions =
        (!dimensions.length || productDimensions.length <= dimensions.length) &&
        (!dimensions.width || productDimensions.width <= dimensions.width) &&
        (!dimensions.height || productDimensions.height <= dimensions.height);

      return matchesCategory && matchesDimensions;
    });

    if (filteredProducts.length > 0) {
      filteredProducts.forEach((item) => {
        sendMessage(
          `- ${item.name}: ${sliceDescription(item.description)}. Price: $${
            item.price
          }. In stock: ${item.stock}`,
          item._id, // Pass product ID along with the message
        );
      });
    } else {
      sendMessage("No matching products found.");
    }
  };

  return (
    <>
      {chatBotState.isOpen ? (
        <div className="chatBox">
          <div className="chatName">
            MinglerAI
            <button
              className="toggleChatBtn"
              onClick={() => dispatch(toggleChatbot(chatBotState.isOpen))}
            >
              <CloseBtn color={"#fff"} />
            </button>
          </div>
          <div className="chatContent">
            {messages.map((msg, idx) => (
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
                    className={"assistantMessageLink"}
                    to={`/products/${msg.id}`}
                  >
                    {msg.text}
                  </Link> // Create a link if there's an ID
                ) : (
                  <span>{msg.text}</span> // Otherwise, just show plain text
                )}
              </div>
            ))}
          </div>
          <div className="chatInputBox">
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", width: "100%" }}
            >
              <input
                className={"chatInput"}
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message..."
                style={{ width: "80%" }}
              />
              <button className={"sendBtn"} type="submit">
                <SendBtnIcon />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          className="closeBtn"
          onClick={() => dispatch(toggleChatbot(chatBotState.isOpen))}
        >
          <ChatBotIcon />
        </button>
      )}
    </>
  );
};

export default ChatBot;
