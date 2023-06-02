import { axiosInstance } from ".";


export const SendMessage =async(message)=>{
    try{

        const response = await axiosInstance.post("/api/messages/new-message",message)
        return (await response).data;
    }catch(error){
        throw error;
    }
}