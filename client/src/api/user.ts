import { AxiosResponse } from "axios";
import { apiClient } from "./client";
import { User } from "@/src/types/User"
import { notifyError } from "../utils/utils";

const BASE_URL = "/users/"

export const fetchProfile = async () => {
  try{
    const response: AxiosResponse<{ user: User }> = await apiClient.get(BASE_URL+"me");
    if(response != null){
      return response.data.user;
    }
  }catch(error:any){
    console.error(error);
  }
}

export const fetchRegisteredUsers =  async () => {
  try {
    const response = await apiClient.get(BASE_URL+'count');
    return response.data.registered_users;
  } catch (error) {
    console.error(error)
    return 0;
  }
}

const UserApi = {fetchProfile, fetchRegisteredUsers}

export default UserApi;