import axios, { AxiosResponse, AxiosError } from 'axios';

type SuccessCallback = (message:string) => void
type ErrorCallback = (error:AxiosError) => void

export async function processUpload(file:File, onSuccess:SuccessCallback, onError:ErrorCallback){
    const formData = new FormData()
    formData.append('file',file)

    onSuccess("Uploading the file...")

    await axios.post('api/upload', formData)
    .then((response: AxiosResponse<{ message: string }>) => {
        onSuccess(response.data.message);
        return processTranscription(file, onSuccess, onError);
    })
    .catch((error:AxiosError) => {
        onError(error);
    });
}

async function processTranscription(file:File, onSuccess:SuccessCallback, onError:ErrorCallback){
    const data = {
        filename:file.name,
    };

    onSuccess("Starting transcription...")
    onSuccess("This might take awhile")
    
    await axios.post('api/transcript', data)
    .then((response: AxiosResponse<{ message: string }>) => {
        onSuccess("Resposta: \n" + response.data);
    })
    .catch((error:AxiosError) => {
        onError(error);
    });
}