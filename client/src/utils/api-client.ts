import axios, { AxiosResponse, AxiosError } from 'axios';
import { FileInfo } from '../shared/FileType';

type SuccessCallback = (message: string) => void
type ErrorCallback = (error: AxiosError) => void

export async function processUpload(file: File, onSuccess: SuccessCallback, onError: ErrorCallback) {
  const formData = new FormData()
  // Append each file to formData
  formData.append("file", file);
  
  console.log("Uploading the file...")

  await axios.post('api/upload', formData)
    .then((response: AxiosResponse<{ message: string }>) => {
      onSuccess(response.data.message);
    })
    .catch((error: AxiosError) => {
      onError(error);
    });
}

export async function processTranscription(file: FileInfo, onSuccess: SuccessCallback, onError: ErrorCallback) {
  // const data = {
  //   filename: file.name,
  // };

  // console.log("Starting transcription...")
  // console.log("This might take awhile")

  // await axios.post('api/transcript', data)
  //   .then((response: AxiosResponse<{ message: string }>) => {
  //     onSuccess("" + response.data);
  //   })
  //   .catch((error: AxiosError) => {
  //     onError(error);
  //   });
}