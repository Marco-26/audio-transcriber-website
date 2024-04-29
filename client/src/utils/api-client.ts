 import axios, { AxiosResponse, AxiosError } from 'axios';

type ResponseCallback = (resp: AxiosResponse) => void
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

export async function processTranscription(file: File, onSuccess: SuccessCallback, onError: ErrorCallback) {
  const data = {
    filename: file.name,
  };

  console.log("Starting transcription...")
  console.log("This might take awhile")
  
  await axios.post('api/transcript', data)
    .then((response: AxiosResponse<{ message: string }>) => {
      onSuccess("" + response.data);
    })
    .catch((error: AxiosError) => {
      onError(error);
    });
}

export async function processDelete(filename: string, onSuccess: SuccessCallback, onError: ErrorCallback) {
  console.log("Deleting file...")

  await axios.delete('api/delete/'+filename)
    .then((response: AxiosResponse<{ message: string }>) => {
      onSuccess("" + response.data);
    })
    .catch((error: AxiosError) => {
      onError(error);
    });
}

export async function processLogin(email: string, password:string, onResponse: ResponseCallback,onError: ErrorCallback) {
  const data = {
    "email": email,
    "password": password
  };

  await axios.post('/login', data)
    .then((response: AxiosResponse<{ message: string }>) => {
      onResponse(response)
    })
    .catch((error: AxiosError) => {
      onError(error);
    });
}

export async function processSignup(email: string, password:string, confirmPassword:string,name:string, onResponse: ResponseCallback,onError: ErrorCallback) {
  const data = {
    "email": email,
    "password": password,
    "confirmPassword":confirmPassword,
    "name":name
  };

  await axios.post('/signup', data)
    .then((response: AxiosResponse<{ message: string }>) => {
      onResponse(response)
    })
    .catch((error: AxiosError) => {
      onError(error);
    });
}