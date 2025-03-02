 import { AxiosResponse, AxiosError } from 'axios';
import { FileEntry } from '../types/FileEntry';
import { apiClient } from './client';
import { notifyError } from '../utils/utils';

export type SuccessCallback = (message: string) => void
export type ErrorCallback = (error: AxiosError) => void

const BASE_URL = "files/"

async function fetchTranscriptionsEntries(user_id: string, filter:string) {
  console.log("HOAJSJ " + filter)
  try{
    const response: AxiosResponse<{ payload: FileEntry[] }> = await apiClient.get(`${BASE_URL}${user_id}`,{
      params:{ filter }
    });
    if(response != null){
      return response.data.payload;
    }

    return []
  }
  catch(error:any){
    console.error(error)
    notifyError("Error while fetching transcriptions entries...")
    return []
  }
}

export async function processTranscription(userID: string,fileID: number) {
  try{
    await apiClient.post(`${BASE_URL}${userID}/${fileID}/transcribe`);
  }
  catch(error:any){
    console.error(error)
    notifyError("Error while processing transcription...")
  }
}

export async function processDelete(fileID: number) {
  try{
    await apiClient.delete(BASE_URL + fileID);
  }
  catch(error:any){
    console.error(error)
    notifyError("Error while deleting transcription entry...")
  }
}

export async function fetchTranscriptedFile(userID: string, fileID: number) {
  try {
    const response: AxiosResponse<{ message: string; payload: string }> = await apiClient.get(`${BASE_URL}${userID}/${fileID}/transcription`);
    return response.data.payload; 
  } catch (error) {
    notifyError("Error while downloading transcripted file...")
    return null; 
  }
}

const TranscriptionsApi = {fetchTranscriptionsEntries,processDelete,processTranscription,fetchTranscriptedFile}

export default TranscriptionsApi;