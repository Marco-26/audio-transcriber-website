import { AxiosResponse } from "axios";
import { FileEntry } from "../types/FileEntry";
import { apiClient } from "./client";
import { notifyError } from "../utils/utils";

async function processUpload(user_id:string,file: File) {
  const formData = new FormData()
  formData.append("file", file);
  formData.append("user_id", user_id);

  try {
    const response: AxiosResponse<{ message: string; fileEntry: FileEntry }> = await apiClient.post('api/upload', formData);
    console.log(response.data.message);
    return response.data.fileEntry; 
  } catch (error:any) {
    console.error(error);
    notifyError("Error uploading the file...")
    return null; 
  }
}

const UploadApi = {processUpload};

export default UploadApi