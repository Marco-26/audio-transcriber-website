 import axios, { AxiosResponse, AxiosError } from 'axios';
import { FileEntry } from '../Types/FileEntry';
import { apiClient } from './client';

export type SuccessCallback = (message: string) => void
export type ErrorCallback = (error: AxiosError) => void

async function fetchTranscriptionsEntries(user_id: string) {
  try{
    const response: AxiosResponse<{ files: FileEntry[] }> = await apiClient.get('api/entries/'+user_id);
    if(response != null){
      return response.data.files;
    }
    return []
  }
  catch(error:any){
    console.error(error)
    return []
  }
}

export async function processTranscription(fileID: number,filename:string) {
  try{
    await apiClient.post('api/transcript/'+fileID+"/"+filename);
  }
  catch(error:any){
    console.error(error)
  }
}

export async function processDelete(fileID: number) {
  try{
    await apiClient.delete('api/delete/' + fileID);
  }
  catch(error:any){
    console.error(error)
  }
}

export async function fetchTranscriptedFile(fileID: number, onSuccess: SuccessCallback, onError: ErrorCallback) {
  try {
    const response: AxiosResponse<{ message: string; transcription: string }> = await apiClient.get('api/transcription/'+fileID);
    onSuccess(response.data.message);
    return response.data.transcription; 
  } catch (error) {
    onError(error as AxiosError);
    return null; 
  }
}

const TranscriptionsApi = {fetchTranscriptionsEntries,processDelete,processTranscription,fetchTranscriptedFile}

export default TranscriptionsApi;