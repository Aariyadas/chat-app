import React, { useEffect } from "react";
import { GetCurrentUser } from "../apiCalls/userapi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { HideLoader, ShowLoader } from "../redux/loaderSlice";
import { SetUser } from "../redux/userSlice";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoader());
      const response = await GetCurrentUser();
      dispatch(HideLoader());
      if (response.success) {
        dispatch(SetUser(response.data));
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
    <div className="min-h-screen min-w-screen bg-gray-100">
      {/* Header */}
      <div className="flex justify-between p-5">
        <div className="flex items-center gap-2">
          <i className="ri-message-3-line text-2xl"></i>
          <h1 className="text-primary text-2xl font-bold">Let's Chat</h1>
        </div>
        <div className="flex flex-col items-end">
          <i className="ri-shield-user-line"></i>
          <h1 className="underline text-sm md:text-base">{user?.name}</h1>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

export default ProtectedRoute;
