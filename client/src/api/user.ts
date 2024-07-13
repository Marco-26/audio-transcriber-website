import { AxiosResponse } from "axios";
import { apiClient } from "./client";
import { User } from "@/src/Types/User"

async function fetchProfile() {
  const response: AxiosResponse<{ user: User }> = await apiClient.get("/@me");
  if(response != null){
    return response.data.user;
  }
}

export async function logout() {
  try {
    await apiClient.post('/logout')
  } catch (error) {
    console.error(error)
  }
}

const UserApi = {fetchProfile, logout}

export default UserApi;