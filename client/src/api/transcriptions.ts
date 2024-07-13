 import axios, { AxiosResponse, AxiosError } from 'axios';
import { FileEntry } from '../Types/FileEntry';
import { apiClient } from './client';

type SuccessCallback = (message: string) => void
type ErrorCallback = (error: AxiosError) => void

export async function fetchTranscriptionsEntries(user_id: string) {
  const response: AxiosResponse<{ files: FileEntry[] }> = await apiClient.get('api/entries/'+user_id);
  if(response != null){
    return response.data.files;
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