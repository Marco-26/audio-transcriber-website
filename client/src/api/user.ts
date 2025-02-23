import { AxiosResponse } from "axios";
import { apiClient } from "./client";
import { User } from "@/src/types/User"

const BASE_URL = "/users/"

export const fetchProfile = async () => {
  try{
    const response: AxiosResponse<{ payload: User }> = await apiClient.get(BASE_URL+"me");
    if(response != null){
      return response.data.payload;
    }
  }catch(error:any){
    console.error(error);
  }
}

export const fetchRegisteredUsers =  async () => {
  try {
    const response: AxiosResponse<{ payload: number }> = await apiClient.get(BASE_URL+'count');
    console.log(response)
    return response.data.payload;
  } catch (error) {
    console.error(error)
    return 0;
  }
}

const UserApi = {fetchProfile, fetchRegisteredUsers}

export default UserApi;