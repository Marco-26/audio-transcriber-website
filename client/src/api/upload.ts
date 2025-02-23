import { AxiosResponse } from "axios";
import { FileEntry } from "../types/FileEntry";
import { apiClient } from "./client";
import { notifyError } from "../utils/utils";

const BASE_URL = "/files/"

async function processUpload(user_id:string,file: File) {
  const formData = new FormData()
  formData.append("file", file);
  formData.append("user_id", user_id);

  try {
    const response: AxiosResponse<{ message: string; payload: FileEntry }> = await apiClient.post(`${BASE_URL}/upload`, formData);
    return response.data.payload; 
  } catch (error:any) {
    console.error(error);
    notifyError("Error uploading the file...")
    return null; 
  }
}

const UploadApi = {processUpload};

export default UploadApi