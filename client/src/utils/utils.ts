import { toast } from 'react-toastify';
import { FileInfo } from '../shared/FileType';

export const formatFileSize = (sizeInBytes: number): string => {
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  const gigabyte = megabyte * 1024;

  if (sizeInBytes < kilobyte) {
    return sizeInBytes + ' B';
  } else if (sizeInBytes < megabyte) {
    return (sizeInBytes / kilobyte).toFixed(2) + ' KB';
  } else if (sizeInBytes < gigabyte) {
    return (sizeInBytes / megabyte).toFixed(2) + ' MB';
  } else {
    return (sizeInBytes / gigabyte).toFixed(2) + ' GB';
  }
}

export const notifyError = (error:string) => {
    toast.error(error, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    }
  )
}

export const generateFileInfo = (file:File, fileName:string) => {
  const info:FileInfo = {
    file:file,
    name:file.name,
    size:file.size,
    transcriptionStatus: "On Wait",
    transcriptionFileName: fileName
  }
  return info
}

export const generateTXT = (transcription:string,fileName:string) => {
  const blob = new Blob([transcription], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName+'.txt';

  a.click();

  URL.revokeObjectURL(url);
}

export const removeFile = (fileToRemove: File,files:FileInfo[]) => {
  if (files) {
    const updatedFiles = files.filter(file => file.file !== fileToRemove);
    return updatedFiles;
  }
};