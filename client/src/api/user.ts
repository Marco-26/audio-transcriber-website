import { AxiosResponse } from "axios";
import { apiClient } from "./client";
import { User } from "@/src/Types/User"
import { notifyError } from "../utils/utils";

export const fetchProfile = async () => {
  try{
    const response: AxiosResponse<{ user: User }> = await apiClient.get("/@me");
    if(response != null){
      return response.data.user;
    }
  }catch(error:any){
    console.error(error);
  }
}

export const login = async (authCode:any) => {
  try {
    const response = await apiClient.post('/google_login', { code: authCode.code });
    return response.data.user;
  }catch (error:any) {
    if (error.response && error.response.status === 401) {
        notifyError('Access restricted. This application is currently in testing.');
    } else {
      notifyError('An error occurred. Please try again.');
    }
}
}

export const logout = async () => {
  try {
    await apiClient.post('/logout')
  } catch (error) {
    console.error(error)
  }
}

export const fetchRegisteredUsers =  async () => {
  try {
    const response = await apiClient.get('/api/fetchRegisteredUsers');
    return response.data.registered_users;
  } catch (error) {
    console.error(error)
    return 0;
  }
}

const UserApi = {login,fetchProfile, logout, fetchRegisteredUsers}

export default UserApi;