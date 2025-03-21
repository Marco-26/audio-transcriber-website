import { notifyError } from "../../utils/utils";
import { apiClient } from "./client";

const BASE_URL = "/auth"

export const login = async (authCode: any) => {
  try {
    const response = await apiClient.post(BASE_URL + '/login', { code: authCode.code });
    return response.data;
  } catch (error: any) {
    notifyError(error.response.data.error);
    return null
  }
}

export const logout = async () => {
  try {
    await apiClient.post(BASE_URL + '/logout')
  } catch (error) {
    console.error(error)
  }
}

const AuthAPI = { login, logout }

export default AuthAPI