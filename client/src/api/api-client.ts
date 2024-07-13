 import axios, { AxiosResponse, AxiosError } from 'axios';
import { FileEntry } from '../Types/FileEntry';
import { User } from '../Types/User';

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
    const response: AxiosResponse<{ message: string; files: FileEntry[] }> = await axios.get('api/entries/'+user_id);
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

export async function processTranscription(fileID: number,filename:string, userID:string,onSuccess: SuccessCallback, onError: ErrorCallback) {
  console.log("Starting transcription...")
  console.log("This might take awhile")
  
  await axios.post('api/transcript/'+fileID+"/"+filename)
    .then((response: AxiosResponse<{ message: string }>) => {
      onSuccess(response.data.message);
    })
    .catch((error: AxiosError) => {
      onError(error);
    });
}

export async function processDelete(fileID: number, userID: string, onSuccess: SuccessCallback, onError: ErrorCallback) {
  console.log("Deleting file with the following ID: "+ fileID)

  await axios.delete('api/delete/' + fileID)
  .then((response: AxiosResponse<{ message: string }>) => {
    onSuccess(response.data.message);
  })
  .catch((error: AxiosError) => {
    onError(error);
  });
}

export async function fetchTranscriptionFile(fileID: number, onSuccess: SuccessCallback, onError: ErrorCallback) {
  try {
    const response: AxiosResponse<{ message: string; transcription: string }> = await axios.get('api/transcription/'+fileID);
    onSuccess(response.data.message);
    return response.data.transcription; 
  } catch (error) {
    onError(error as AxiosError);
    return ""; 
  }
}

export async function fetchProfile(onSuccess: SuccessCallback, onError: ErrorCallback) {
  try {
    const response: AxiosResponse<{ message: string; user: User }> = await axios.get('@me');
    onSuccess(response.data.message);
    return response.data.user;
  } catch (error) {
    onError(error as AxiosError);
    return null; 
  }
}

export async function logout() {
  try {
    await axios.post('/logout');
  } catch (error) {
    console.error(error)
  }
}