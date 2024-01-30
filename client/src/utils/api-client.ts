import axios, { AxiosResponse, AxiosError } from 'axios';

type SuccessCallback = (message:string) => void
type ErrorCallback = (error:AxiosError) => void

export async function processUpload(file:File, onSuccess:SuccessCallback, onError:ErrorCallback){
    const formData = new FormData()
    formData.append('file',file)

    axios.post('api/transcribe', formData)
    .then((response: AxiosResponse<{ message: string }>) => {
        onSuccess(response.data.message);
    })
    .catch((error:AxiosError) => {
        onError(error);
    });
}