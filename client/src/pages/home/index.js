import React from "react";


import { useSelector } from "react-redux";
import UserSearch from "./components/UserSearch";
import UserList from "./components/UserList"
import ChatScreen from './components/ChatScreen'

const Home = () => {
  const [searchKey, setSearchKey] = React.useState("");
  const {selectedChat} =useSelector((state)=>state.userReducer)
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
          <ChatScreen />
        </div>
      )}
    </div>
  );
};

export default Home;
