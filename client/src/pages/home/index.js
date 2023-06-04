import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import UserList from "./components/UserList";
import ChatScreen from "./components/ChatScreen";
import UserSearch from "./components/UserSearch";

import { io } from "socket.io-client";

const Home = () => {
  const socket = io("http://localhost:5000");

  const [searchKey, setSearchKey] = React.useState("");
  const { selectedChat, user } = useSelector((state) => state.userReducer);

  useEffect(() => {
    if (user) {
      socket.emit("join-room", user._id);
      // send new message  to recepient
      socket.emit("send-message", {
        text: "Hi Jetlin ,This is from Ariya",
        sender:user._id,
        recepient: "647886c121d8c5c24ce9a857",
      });
      // receive message from recepient
      socket.on("receive-message",(data)=>{
        console.log("data",data)
      })

    }
  }, [user]);

  return (
    <div className="flex gap-5">
      {/* user Search Chat List */}
      <div className="w-96">
        <UserSearch serachKey={searchKey} setSearchKey={setSearchKey} />
        <UserList searchKey={searchKey} />
      </div>
      {/* 2nd Part Chat Area */}

      {selectedChat && (
        <div className="w-full">
          <ChatScreen socket={socket} />
        </div>
      )}
    </div>
  );
};

export default Home;
