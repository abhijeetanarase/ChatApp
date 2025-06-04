import { useState, useEffect, useRef } from "react";
import { Phone, Video, MoreVertical } from "lucide-react";
import Message from "./components/Message";
import MessageInput from "../../components/MessageInput";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useContact } from "../../features/contact/contactSlice";
import {
  fetchMessages,
  setMessages,
  useChat,
} from "../../features/chat/chatSlice";

const ChatArea = () => {
  const { currentChat } = useSelector(useContact);
  const [newMessage, setNewMessage] = useState({});
  const { messages } = useSelector(useChat);
  const [currentMessage, setCurrentMessage] = useState("");
  const typingTimeoutRef = useRef();


  console.log(messages);
  

  // const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:4000", {
      auth: {
        token: localStorage.getItem("authToken"),
      },
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (
      !socketRef.current ||
      !currentChat?._id ||
      newMessage.sender === "other"
    )
      return;

    socketRef.current.emit("private_chat", {
      toUserId: currentChat._id,
      message: newMessage.content,
    });
  }, [newMessage]);
  console.log(currentMessage);

useEffect(() => {
  if (currentMessage) {
    socketRef.current.emit("typing", { toUserId: currentChat._id, typing: true });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to emit `typing: false` after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit("typing", { toUserId: currentChat._id, typing: false });
    }, 2000);
  } else {
    // If input is cleared, immediately emit typing: false
    socketRef.current.emit("typing", { toUserId: currentChat._id, typing: false });

    // Clear timeout if it exists
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }

  // Clean up on unmount
  return () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };
}, [currentMessage]);

  useEffect(() => {
    if (!socketRef.current || !currentChat?._id) return;

    socketRef.current.on("private_message", ({ from, message }) => {
      dispatch(setMessages(message));
    });

    return () => socketRef.current.off("private_message");
  }, [currentChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (currentChat._id) {
      dispatch(fetchMessages(currentChat._id));
    }
  }, [currentChat._id]);

  return (
    <div className="flex-1 flex flex-col h-screen bg-white dark:bg-gray-900">
      {currentChat._id ? (
        <>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center bg-white dark:bg-gray-800 shadow-sm">
            <div className="relative">
              <img
                src={currentChat.picture}
                alt={currentChat.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800" />
            </div>
            <div className="ml-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                {currentChat.name}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-400">
                Online
              </p>
            </div>
            <div className="ml-auto flex gap-3">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <Phone className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <Video className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Message list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50 dark:bg-gray-800">
            <div className="space-y-4">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message input */}
          <div className="bg-white dark:bg-gray-900  ">
            <MessageInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              currentMessage={currentMessage}
              setCurrentMessage={setCurrentMessage}
            />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
          Select a contact to start chatting
        </div>
      )}
    </div>
  );
};

export default ChatArea;
