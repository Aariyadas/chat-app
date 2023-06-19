import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiSendPlaneLine } from "react-icons/ri";
import { GetMessages, SendMessage } from "../../../apiCalls/messageapi";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import { toast } from "react-hot-toast";
import { BsEmojiLaughing } from "react-icons/bs";
import { BsImages } from "react-icons/bs";

import moment from "moment";
import store from "../../../redux/store";
import { ClearChatMessage } from "../../../apiCalls/chatapi";
import { SetAllChats } from "../../../redux/userSlice";
import EmojiPicker from "emoji-picker-react";

const ChatScreen = ({ socket }) => {
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [isReceipentTyping, setIsReceipentTyping] = React.useState(false);
  const dispatch = useDispatch();
  const [newMessage, setNewMessages] = React.useState("");

  const { selectedChat, user, allChats } = useSelector(
    (state) => state.userReducer
  );
  const [messages = [], setMessages] = React.useState([]);
  console.log(selectedChat);
  const receipentUser = selectedChat.members.find(
    (mem) => mem._id !== user._id
  );

  const sendNewMessage = async (image) => {
    try {
      const message = {
        chat: selectedChat._id,

        sender: user._id,
        text: newMessage,
        image,
      };
      // Sending message to server using socket
      socket.emit("send-message", {
        ...message,
        members: selectedChat.members.map((mem) => mem._id),
        createdAt: moment().format("DD-MM-YYYY hh:mm:ss"), // Fix: Corrected the format
        read: false,
      });
      // sending and storing data in db
      const response = await SendMessage(message);

      if (response.success) {
        setNewMessages("");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  console.log(receipentUser);

  const getMessages = async () => {
    try {
      dispatch(ShowLoader());
      const response = await GetMessages(selectedChat._id);
      dispatch(HideLoader());
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };

  const clearUnreadMessages = async () => {
    try {
      socket.emit("clear-unread-messages", {
        chat: selectedChat._id,
        members: selectedChat.members.map((mem) => mem._id),
      });

      const response = await ClearChatMessage(selectedChat._id);

      if (response.success) {
        const updatedChats = allChats.map((chat) => {
          if (chat._id === selectedChat._id) {
            return response.data;
          }
          return chat;
        });
        
        dispatch(SetAllChats(updatedChats));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDateInRegularFormat = (date) => {
    let result = "";
    //if date is today return today

    if (moment(date).isSame(moment(), "day")) {
      result = moment(date).format("hh:mm");
    }
    //if date is yesterday return yesterday and time
    else if (moment(date).isSame(moment().subtract(1, "day"), "day")) {
      result = `Yesterday ${moment(date).format("hh:mm")}`;
    }
    //  If date is this year return date in MM DD format
    else if (moment(date).isSame(moment(), "year")) {
      result = moment(date).format("MM/DD hh:mm");
    }

    return result;
  };

  useEffect(() => {
    getMessages();
    if (selectedChat?.lastMessage?.sender !== user._id) {
      clearUnreadMessages();
    }
    // receive message from server using socket
    socket.off("receive-message").on("receive-message", (message) => {
      const tempSelectedChat = store.getState().userReducer.selectedChat;
      if (tempSelectedChat._id === message.chat) {
        setMessages((messages) => [...messages, message]);
      }
      if (
        tempSelectedChat._id === message.chat &&
        message.sender !== user._id
      ) {
        clearUnreadMessages();
      }
    });

    socket.on("unread-messages-clear", (data) => {
      const tempAllChats = store.getState().userReducer.allChats;
      const tempSelectedChat = store.getState().userReducer.selectedChat;
      if (data.chat === tempSelectedChat._id) {
        const updatedChats = tempAllChats.map((chat) => {
          if (chat._id === data.chat) {
            return {
              ...chat,
              clearUnreadMessages: 0,
            };
          }
          return chat;
        });
        dispatch(SetAllChats(updatedChats));

        // set all messages as read
        setMessages((prevMessages) => {
          return prevMessages.map((messages) => {
            return {
              ...messages,
              read: true,
            };
          });
        });
      }
    });

    socket.on("started-typing", (data) => {
      const selectedChat = store.getState().userReducer.selectedChat;
      if (data.chat === selectedChat._id && data.sender !== user._id) {
        setIsReceipentTyping(true);
      }
      setTimeout(() => {
        setIsReceipentTyping(false);
      }, 1500);
    });
  }, [selectedChat]);

  useEffect(() => {
    // always scroll to bottom For messages
    const messagesContainer = document.getElementById("messages");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages, isReceipentTyping]);

  const onUploadImageClick = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      sendNewMessage(reader.result);
    };
  };
  return (
    <div className="bg-white h-[82vh] border rounded-2xl w-full flex flex-col justify-between p-5 ">
      {/* 1st part recipient user */}
      <div>
        <div className="flex gap-5 items-center mb-2">
          {receipentUser.profilePic && (
            <img
              src={receipentUser.profilePic}
              alt="profile pic"
              className="w-10 h-10 rounded-full"
            />
          )}
          {!receipentUser.profilePic && (
            <div className="bg-gray-500 rounded-full h-10 w-10 flex items-center justify-center">
              <h1 className="uppercase text-white text-xl font-semibold">
                {receipentUser.name[0]}
              </h1>
            </div>
          )}

          <h1 className="uppercase">{receipentUser.name}</h1>
        </div>
        <hr />
      </div>
      {/* 2nd part chat message */}
      <div className="h-[55vh] overflow-y-scroll p-5" id="messages">
        <div className="flex flex-col gap-2">
          {messages.map((message, index) => {
            const isCurrentUserIsSender = message.sender === user._id;

            return (
              <div className={`flex ${isCurrentUserIsSender && "justify-end"}`}>
                <div className="flex flex-col gap-1">
                  <h1
                    className={`${
                      isCurrentUserIsSender
                        ? "bg-primary text-white rounded-bl-none"
                        : "bg-gray-300 text-primary rounded-tr-none"
                    }
                   p-2 rounded-xl `}
                  >
                    {message.text}
                  </h1>

                  {message.image && (
                    <img
                      src={message.image}
                      alt="message"
                      className="w-24 h-24 rounded-xl"
                    />
                  )}

                  <h1 className="text-gray-500 text-sm">
                    {getDateInRegularFormat(message.createdAt)}
                  </h1>
                </div>
                {isCurrentUserIsSender &&
                  message.read && (
                    <div className="p-2">
                      {receipentUser.profilePic && (
                        <img
                          src={receipentUser.profilePic}
                          alt="profile pic"
                          className="w-4 h-4 rounded-full"
                        />
                      )}
                      {!receipentUser.profilePic && (
                        <div className="bg-gray-400 rounded-full h-4 w-4  flex items-center justify-center relative">
                          <h1 className="uppercase text-white text-xs font-semibold">
                            {receipentUser.name[0]}
                          </h1>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            );
          })}
          {isReceipentTyping && (
            <div className="pb-10">
              <h1 className="bg-blue-100 text-primary  p-2 rounded-x w-max">
                typing...
              </h1>
            </div>
          )}
        </div>
      </div>
      {/* 3rd part chat input */}
      <div className="h-18 rounded-xl border-gray-300 shadow border flex flex-col sm:flex-row justify-between p-2 items-center relative">
        {showEmojiPicker && (
          <div className="absolute -top-96 left-0">
            <EmojiPicker
              height={350}
              onEmojiClick={(e) => {
                setNewMessages(newMessage + e.emoji);
                setShowEmojiPicker(false);
              }}
            />
          </div>
        )}
        <div className="flex gap-2 text-xl">
          <label for="file">
            <BsImages className="cursor-pointer text-xl" typeof="file" />
            <input
              type="file"
              id="file"
              style={{
                display: "none",
              }}
              accept="image/gif,image/jpeg,image/jpg,image/png"
              onChange={onUploadImageClick}
            />
          </label>
          <BsEmojiLaughing
            className="cursor-pointer text-xl"
            on
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
        </div>

        <input
          type="text"
          placeholder="Type a message"
          className="w-full sm:w-[90%] border-0 h-full rounded-xl sm:mr-2 focus:border-none"
          value={newMessage}
          onChange={(e) => {
            setNewMessages(e.target.value);
            const messagesContainer = document.getElementById("messages");
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            socket.emit("typing", {
              chat: selectedChat._id,
              members: selectedChat.members.map((mem) => mem._id),
              sender: user._id,
            });
          }}
        />
        <button
          className="bg-black text-white py-1 px-5 rounded h-max mt-2 sm:mt-0 sm:w-auto"
          onClick={() => sendNewMessage("")}
        >
          <RiSendPlaneLine className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
