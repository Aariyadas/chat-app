import React from "react";
import { Link } from "react-router-dom";
import { LoginUser } from "../../apiCalls/userapi";
import { toast } from "react-hot-toast";

const Login = () => {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const loginUser =async()=>{
    try{
      const response =await LoginUser(user);
      if(response.success){
        toast.success(response.message);
      }else{
        toast.error(response.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }




  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          'url("https://img.freepik.com/free-vector/purple-pink-halftone-badge-vector_53876-67291.jpg?w=740&t=st=1684814672~exp=1684815272~hmac=4a7e79d54f646c8840e1e7f9e09b023a3fe0a3d474562db16eb0bad1f8bb5b46")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white shadow-lg rounded-xl p-5 flex flex-row gap-3 w-96">
        <div>
          <img
            src="https://png.pngtree.com/thumb_back/fh260/background/20210115/pngtree-handheld-mobile-phone-chat-design-concept-image_524282.jpg"
            alt="Background"
            className="h-64 w-64 object-cover rounded-xl"
          />
        </div>
        <div className="flex flex-col gap-5">
          <h1 className="text-1xl uppercase font-bold">Let's Chat Login</h1>

          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your valid email"
            className="p-3 border border-gray-300 rounded-lg shadow-sm"
          />
          <input
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
            className="p-3 border border-gray-300 rounded-lg shadow-sm"
          />
          <button className="contained-btn"
          onClick={loginUser}>Login</button>
          <Link to="/register" className="underline">
            Don't you have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
