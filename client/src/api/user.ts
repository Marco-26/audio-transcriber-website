import { AxiosResponse } from "axios";
import { apiClient } from "./client";
import { User } from "@/src/Types/User"

async function fetchProfile() {
  const response: AxiosResponse<{ user: User }> = await apiClient.get("/@me");
  if(response != null){
    return response.data.user;
  }
}

const UserApi = {fetchProfile}

export default UserApi;