import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../apiCalls/userapi";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { HideLoader, ShowLoader } from "../../redux/loaderSlice";
import { TbMessageDots } from "react-icons/tb";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const loginUser = async () => {
    try {
      dispatch(ShowLoader());
      console.log("Ariya");
      const response = await LoginUser(user);
      dispatch(HideLoader());
      if (response.success) {
        toast.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-zinc-200 to-slate-200">
      <div className=" bg-white shadow-lg rounded-xl p-5  flex flex-col gap-5 w-full sm:w-96 mx-4 	border-color: inherit;">
        <div className="flex gap-3 ">
      <TbMessageDots className= "text-2xl gap-2"/>
        <h1 className="text-2xl uppercase font-bold text-primary text align-center">Let's Chat Login{""}
        </h1>
       </div>
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Enter your valid email"
          className="p-3 border border-primary rounded-lg shadow-sm"
        />
        <input
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Enter your password"
          className="p-3 border border-primary rounded-lg shadow-sm"
        />
        <button className={
          user.email && user.password ?"contained-btn" :"disabled-btn"
        } onClick={loginUser}>
          Login
        </button>
        <Link to="/register" className="underline">
          Don't you have an account? Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
