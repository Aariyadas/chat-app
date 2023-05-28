import React, { useEffect } from 'react'
import { GetCurrentUser } from '../apiCalls/userapi'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-hot-toast";
const ProtectedRoute = ({children}) => {
  const [user,setUser]=React.useState(null)
  const navigate=useNavigate();
  const getCurrentUser =async() =>{
    try{
      const response=await GetCurrentUser()
      if(response.success){
       setUser(response.data)
      }else{
        toast.error(response.message)
        navigate('/login')
        return false
      }

    }catch(error){
      toast.error(error.message)
      navigate('/login')

    }
  }

  useEffect(()=>{
   if(localStorage.getItem("token")){
    getCurrentUser()
   }
  },[])

  return (
    <div>
      <h1>
    {user?.name}
    </h1>
    {user?.email}
  {children}
  </div>
  )
}

export default ProtectedRoute