import React, { useState, useEffect, useRef, useCallback } from "react";
import { User, Bot, ArrowRight } from "lucide-react";
import { SUBMITTAL_CODES, SUBMITTAL_URLS } from "./constant";
import $ from "jquery";

// Separate TypewriterText component
const TypewriterText = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 30);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return <span>{displayedText}</span>;
};

// Separate Message component
const Message = ({ message, isTyping, isLastMessage }) => {
  const [showTypingAnimation, setShowTypingAnimation] = useState(false);

  useEffect(() => {
    if (
      message.sender === "bot" &&
      message.message !== "AI is thinking..." &&
      isLastMessage
    ) {
      setShowTypingAnimation(true);
    }
  }, [message, isLastMessage]);

  return (
    <div
      style={{
        textAlign: message.sender === "user" ? "right" : "left",
        margin: "10px 0",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
        gap: "8px",
      }}
    >
      {message.sender === "bot" && (
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#e3f2fd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bot size={16} color="#1976d2" />
        </div>
      )}
      <div
        style={{
          display: "inline-block",
          maxWidth: "80%",
        }}
      >
        <span
          style={{
            display: "inline-block",
            padding: "8px 12px",
            borderRadius: "15px",
            backgroundColor: message.sender === "user" ? "#007bff" : "#f1f1f1",
            color: message.sender === "user" ? "#fff" : "#333",
          }}
        >
          {showTypingAnimation ? (
            <TypewriterText
              text={message.message}
              onComplete={() => setShowTypingAnimation(false)}
            />
          ) : (
            message.message
          )}
        </span>
        <div
          style={{
            fontSize: "10px",
            color: "#666",
            marginTop: "5px",
            textAlign: message.sender === "user" ? "right" : "left",
          }}
        >
          {message.timestamp}
        </div>
      </div>
      {message.sender === "user" && (
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#e8eaf6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <User size={16} color="#3f51b5" />
        </div>
      )}
    </div>
  );
};

// Separate Modal component
const DataModal = ({
  isOpen,
  onClose,
  chatbotData,
  items,
  activeTab,
  setActiveTab,
  userName,
  loader,
}) => {
  if (!isOpen) return null;

  const tabs = [
    { id: "pending", label: "Pending" },
    { id: SUBMITTAL_CODES.ID_DPU_SUBMITTAL_CODE, label: "DPU" },
    { id: SUBMITTAL_CODES.ID_SD_SUBMITTAL_CODE, label: "SD" },
    { id: SUBMITTAL_CODES.ID_MS_SUBMITTAL_CODE, label: "MS" },
    { id: SUBMITTAL_CODES.ID_MIR_SUBMITTAL_CODE, label: "MIR" },
    { id: SUBMITTAL_CODES.ID_WIR_SUBMITTAL_CODE, label: "WIR" },
    { id: SUBMITTAL_CODES.ID_TS_SUBMITTAL_CODE, label: "TS" },
    { id: SUBMITTAL_CODES.ID_RFI_SUBMITTAL_CODE, label: "RFI" },
    { id: SUBMITTAL_CODES.ID_LTR_SUBMITTAL_CODE, label: "LTR" },
    { id: SUBMITTAL_CODES.ID_EI_SUBMITTAL_CODE, label: "EI" },
    { id: SUBMITTAL_CODES.ID_NCR_SUBMITTAL_CODE, label: "NCR" },
  ];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "350px",
        width: "450px",
        height: "550px",
        backgroundColor: "#fff",
        borderTop: "1px solid #ddd",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        zIndex: 1001,
        overflowY: "auto",
        textAlign: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgb(56, 20, 68)",
          color: "#fff",
          padding: "10px",
          fontSize: "16px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 2,
        }}
      >
        <div>Pending Details</div>
        <button
          onClick={onClose}
          style={{
            backgroundColor: "transparent",
            color: "#fff",
            border: "none",
            fontSize: "14px",
            cursor: "pointer",
            padding: "5px 10px",
          }}
        >
          X
        </button>
      </div>
      {loader ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "90%",
          }}
        >
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "4px solid #E9D5FF",
              }}
            />
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "4px solid rgb(56, 20, 68)",
                borderTopColor: "transparent",
                position: "absolute",
                top: 0,
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
          <span
            style={{
              marginTop: "16px",
              fontSize: "18px",
              color: "rgb(56, 20, 68)",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          >
            Loading...
          </span>
          <style>
            {`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
            @keyframes pulse {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: .5;
              }
            }
          `}
          </style>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              backgroundColor: "#f5f5f5",
              padding: "10px",
              gap: "10px",
              position: "sticky",
              top: "46px",
              zIndex: 1,
              maxWidth: "100%",
              overflowX: "scroll",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                }}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  backgroundColor:
                    activeTab === tab.id ? "rgb(56, 20, 68)" : "#fff",
                  color: activeTab === tab.id ? "#fff" : "#333",
                  fontWeight: activeTab === tab.id ? "bold" : "normal",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                }}
              >
                {tab.label}
                <span
                  style={{
                    marginLeft: "5px",
                    backgroundColor:
                      activeTab === tab.id ? "#fff" : "rgb(56, 20, 68)",
                    color: activeTab === tab.id ? "rgb(56, 20, 68)" : "#fff",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    fontSize: "12px",
                  }}
                >
                  {items && items[tab.id] ? items[tab.id].length : 0}
                </span>
              </button>
            ))}
          </div>

          <p>{userName}</p>

          {items && items[activeTab] && items[activeTab].length > 0 ? (
            items[activeTab].map((data) => (
              <a
                key={data.SubmittalID}
                href={`${SUBMITTAL_URLS[data.SubmittalType]}${
                  data.SubmittalApproverID
                }`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                  all: "unset",
                }}
              >
                <div
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    padding: "10px",
                    margin: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                    backgroundColor: "#fff",
                  }}
                >
                  <div style={{ textAlign: "left", width: "92%" }}>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "16px" }}>
                      {data.SubmittalRefNo}
                    </h3>
                    <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                      {data.Description}
                    </p>
                  </div>
                  <ArrowRight width={20} height={20} />
                </div>
              </a>
            ))
          ) : (
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "5px",
                padding: "10px",
                margin: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                backgroundColor: "#fff",
                height: "70%",
              }}
            >
              <h3 style={{ textAlign: "center" }}>No pending list</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const Chatbot = ({ apiEndpoint, pendingListEndpoint }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [userName, setUserName] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [pendingList, setPendingList] = useState({
    pending: [],
    [SUBMITTAL_CODES.ID_SD_SUBMITTAL_CODE]: [],
    [SUBMITTAL_CODES.ID_MS_SUBMITTAL_CODE]: [],
    [SUBMITTAL_CODES.ID_MIR_SUBMITTAL_CODE]: [],
    [SUBMITTAL_CODES.ID_WIR_SUBMITTAL_CODE]: [],
    [SUBMITTAL_CODES.ID_TS_SUBMITTAL_CODE]: [],
    [SUBMITTAL_CODES.ID_RFI_SUBMITTAL_CODE]: [],
    [SUBMITTAL_CODES.ID_DPU_SUBMITTAL_CODE]: [],
    [SUBMITTAL_CODES.ID_LTR_SUBMITTAL_CODE]: [],
    [SUBMITTAL_CODES.ID_EI_SUBMITTAL_CODE]: [],
    [SUBMITTAL_CODES.ID_NCR_SUBMITTAL_CODE]: [],
  });
  const [totalPendingList, setTotalPendingList] = useState(0);
  // const [totalData, setTotalData] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatbotData, setChatbotData] = useState({
    topBorderColor: "#007bff",
    chatBotColor: "#fff",
    chatBotLogo: "",
    backgroundLogo: "",
    initialMsg: "Hi! How can I help you today?",
    topBorderTitle: "Chatbot",
    loginUser: "",
    notificationCount: 0,
  });

  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const fetchPendingData = async () => {
    try {
      return await new Promise((resolve, reject) => {
        $.ajax({
          url: "/Common/GetAllActionPendingListJSON",
          type: "POST",
          dataType: "json",
          success: function (response) {
            resolve(response);
          },
          error: function (xhr, status, error) {
            console.error("AJAX Error:", error);
            reject(error);
          },
        });
      });
    } catch (error) {
      console.error("Error fetching pending data:", error);
      setListLoading(false);
      throw error;
    }
  };

  const processPendingData = (response) => {
    if (!response) return;

    let tempResult = { pending: response };

    // Reverse lookup object to match values
    const reversedSubmittalCodes = Object.fromEntries(
      Object.entries(SUBMITTAL_CODES).map(([key, value]) => [value, key])
    );

    // Initialize submittal code categories
    Object.keys(SUBMITTAL_CODES).forEach((key) => {
      tempResult[SUBMITTAL_CODES[key]] = [];
    });

    // Single loop to categorize items
    response.forEach((item) => {
      const submittalKey = reversedSubmittalCodes[item.SubmittalType];

      if (submittalKey) {
        tempResult[SUBMITTAL_CODES[submittalKey]].push(item);
      } else {
        console.warn(`Unknown SubmittalType: ${item.SubmittalType}`);
      }
    });

    setPendingList(tempResult);
    setTimeout(() => {
      setListLoading(false);
    }, 2000);
  };

  const fetchPendingList = useCallback(async () => {
    try {
      setListLoading(true);
      const response = await fetchPendingData();
      if (response) {
        setTotalPendingList(response.length);
        // setTotalData(response);
        processPendingData(response);
      }
    } catch (error) {
      console.error("Error in fetchPendingList:", error);
    }
  }, []);

  useEffect(() => {
    const fetchChatbotConfig = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setChatbotData({
          topBorderColor: data.topBorderColor || "#007bff",
          chatBotColor: data.chatBotColor || "#fff",
          chatBotLogo: data.chatBotLogo || "",
          backgroundLogo: data.backgroundLogo || "",
          initialMsg: data.initialMsg || "Hi! How can I help you today?",
          topBorderTitle: data.topBorderTitle || "Chatbot",
          loginUser: data.loginUser || "",
          notificationCount: data.notificationCount || 0,
        });

        setChatHistory([
          {
            sender: "bot",
            message: data.initialMsg || "Hi! How can I help you today?",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch chatbot configuration:", error);
      }
    };

    const fetchSessionData = async () => {
      try {
        $.ajax({
          url: "/Home/GetSessionValues/",
          type: "POST",
          dataType: "json",
          success: async function (response) {
            if (!response["Username"]) {
              setIsLoggedIn(false);
            } else {
              setIsLoggedIn(true);
              setUserName(response["Username"]);
            }
          },
          error: function (xhr, status, error) {
            console.error("AJAX Error:", error);
            setIsLoggedIn(false);
          },
        });
      } catch (error) {
        setIsLoggedIn(false);
        console.error("Failed to fetch chatbot configuration:", error);
      }
    };
    fetchChatbotConfig();
    fetchSessionData();
  }, [apiEndpoint]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatHistory, isOpen]);

  const toggleChatbot = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    setIsModalOpen(false);
  };

  const toggleModal = (e) => {
    if (!isLoggedIn) return; // Exit early if not logged in
  
    e.stopPropagation();
  
    setIsModalOpen((prev) => !prev); // Use functional state update
    fetchPendingList();
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    const newUserMessage = {
      sender: "user",
      message: userInput,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const thinkingMessage = {
      sender: "bot",
      message: "AI is thinking...",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatHistory((prev) => [...prev, newUserMessage, thinkingMessage]);
    setUserInput("");

    try {
      const response = await fetch(process.env.REACT_APP_CHATBOT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userInput }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const botResponseMessage = {
        sender: "bot",
        message: data.answer || "I'm sorry, I couldn't process your request.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatHistory((prev) => [...prev.slice(0, -1), botResponseMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = {
        sender: "bot",
        message: "I'm sorry, I couldn't process your request.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatHistory((prev) => [...prev.slice(0, -1), errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
      }}
    >
      {isOpen && (
        <div
          style={{
            position: "relative",
            borderRadius: "10px",
            width: "320px",
            height: "400px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
            animation: "fadeIn 0.3s ease-in-out",
            marginBottom: "10px",
            overflow: "hidden",
            backgroundColor: "white",
            zIndex: -2,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${chatbotData.backgroundLogo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.1,
              zIndex: -1,
            }}
          />
          <div
            style={{
              backgroundColor: chatbotData.topBorderColor,
              color: "#fff",
              padding: "10px",
              fontSize: "16px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>{chatbotData.topBorderTitle}</div>
            <button
              onClick={toggleChatbot}
              style={{
                backgroundColor: "transparent",
                color: "#fff",
                border: "none",
                fontSize: "14px",
                cursor: "pointer",
                padding: "5px 10px",
              }}
            >
              X
            </button>
          </div>

          <div
            ref={chatContainerRef}
            style={{
              flex: 1,
              padding: "15px",
              fontSize: "14px",
              color: "#333",
              overflowY: "auto",
            }}
          >
            {chatHistory.map((chat, index) => (
              <Message
                key={index}
                message={chat}
                isLastMessage={index === chatHistory.length - 1}
                isTyping={chat.message === "AI is thinking..."}
              />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: "5px",
              padding: "10px",
              borderTop: "1px solid #ddd",
              backgroundColor: "#fff",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                outline: "none",
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                backgroundColor: chatbotData.topBorderColor,
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <DataModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          chatbotData={chatbotData}
          items={pendingList}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          loader={listLoading}
        />
      )}

      {!isOpen ? (
        <div
          onClick={toggleChatbot}
          style={{
            backgroundColor: chatbotData.chatBotColor,
            color: "#fff",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
          }}
        >
          {chatbotData.chatBotLogo ? (
            <img
              src={chatbotData.chatBotLogo}
              alt=""
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
          ) : (
            "💬"
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: chatbotData.topBorderColor,
            borderRadius: "10px",
            padding: "10px",
            gap: "10px",
            color: "#fff",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flex: 1,
            }}
          >
            <div
              onClick={toggleModal}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                cursor: "pointer",
              }}
            >
              👤
              {isLoggedIn && (
                <div
                  style={{
                    position: "absolute",
                    top: "-3px",
                    right: "-3px",
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    width: "15px",
                    height: "15px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {totalPendingList}
                </div>
              )}
            </div>
            <div style={{ fontSize: "14px" }}>
              {userName ? userName : "Guest"}
            </div>
          </div>
          <div
            onClick={toggleChatbot}
            style={{
              backgroundColor: chatbotData.chatBotColor,
              color: "#fff",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
            }}
          >
            {chatbotData.chatBotLogo ? (
              <img
                src={chatbotData.chatBotLogo}
                alt=""
                style={{ width: "30px", height: "30px", objectFit: "cover" }}
              />
            ) : (
              "💬"
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
