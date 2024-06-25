 import axios, { AxiosResponse, AxiosError } from 'axios';
import { FileEntry } from '../shared/Types';

type ResponseCallback = (resp: AxiosResponse) => void
type SuccessCallback = (message: string) => void
type ErrorCallback = (error: AxiosError) => void

export async function getTranscriptionsEntries(
  user_id: string,
  onSuccess: SuccessCallback,
  onError: ErrorCallback
): Promise<FileEntry[]> {
  const formData = new FormData();
  formData.append('user_id', user_id);

  try {
    const response: AxiosResponse<{ message: string; files: FileEntry[] }> = await axios.post('api/entries', formData);
    onSuccess(response.data.message);
    return response.data.files; 
  } catch (error) {
    onError(error as AxiosError);
    return []; 
  }
}

export async function processUpload(user_id:string,file: File, onSuccess: SuccessCallback, onError: ErrorCallback) {
  const formData = new FormData()
  formData.append("file", file);
  formData.append("user_id", user_id);

  try {
    const response: AxiosResponse<{ message: string; fileEntry: FileEntry }> = await axios.post('api/upload', formData);
    onSuccess(response.data.message);
    return response.data.fileEntry; 
  } catch (error) {
    onError(error as AxiosError);
    return undefined; 
  }
}

export async function processTranscription(file: File, onSuccess: SuccessCallback, onError: ErrorCallback) {
  const data = {
    filename: file.name,
  };

  console.log("Starting transcription...")
  console.log("This might take awhile")
  
  await axios.post('api/transcript', data)
    .then((response: AxiosResponse<{ message: string }>) => {
      onSuccess(response.data.message);
    })
    .catch((error: AxiosError) => {
      onError(error);
    });
}

export async function processDelete(id: number, onSuccess: SuccessCallback, onError: ErrorCallback) {
  console.log("Deleting file with the following ID: "+ id)

  await axios.delete('api/delete/'+id)
    .then((response: AxiosResponse<{ message: string }>) => {
      onSuccess(response.data.message);
    })
    .catch((error: AxiosError) => {
      onError(error);
    });
}