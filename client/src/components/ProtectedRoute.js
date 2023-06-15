import React, { useEffect } from "react";
import { GetAllUsers, GetCurrentUser } from "../apiCalls/userapi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { HideLoader, ShowLoader } from "../redux/loaderSlice";
import { SetUser, SetAllUsers, SetAllChats } from "../redux/userSlice";
import { GetAllChats } from "../apiCalls/chatapi";
import { CiUser } from "react-icons/ci";
import { LuLogOut } from "react-icons/lu";
import { TbMessageDots } from "react-icons/tb";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoader());
      const response = await GetCurrentUser();
      const allUsersResponse = await GetAllUsers();
      const allChatResponse = await GetAllChats();
      dispatch(HideLoader());
      if (response.success) {
        dispatch(SetUser(response.data));
        dispatch(SetAllUsers(allUsersResponse.data));
        dispatch(SetAllChats(allChatResponse.data));
      } else {
        toast.error(response.message);
        navigate("/login");
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 p-2">
      {/* Header */}
      <div className="flex justify-between p-5 ">
        <div className="flex items-center gap-1">
          <TbMessageDots className="text-2xl" />
          <h1
            className="text-primary text-2xl uppercase font-bold cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            Let's Chat
          </h1>
        </div>
        <div className="flex gap-2 text-md items-center bg-white p-2 rounded">{
          user?.profilePic && 
          <img
          src ={user?.profilePic}
          alt="profile" className="h-8 w-8 rounded-full object-cover"/>
        }
         {!user?.profilePic && <CiUser className="gap-1 text-primary" />}
          <h1
            className="underline text-sm md:text-base  cursor-pointer text-primary"
            onClick={() => {
              navigate("/profile");
            }}
          >
            {user?.name}
          </h1>
          <LuLogOut
            className="ml-5 text-xl cursor-pointer text-primary"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          />
        </div>
      </div>
      <div className="py-5">{children}</div>
    </div>
  );
};

export default ProtectedRoute;
