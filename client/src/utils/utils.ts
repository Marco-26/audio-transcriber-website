import { toast } from 'react-toastify';
import { FileEntry } from '../types/FileEntry';

export const MAX_FILES_USER = 10

export const updateFiles = (prevFiles:FileEntry[], newFile:FileEntry) => {
  if (!prevFiles) {
    return [newFile];
  } else {
    return [...prevFiles, newFile];
  }
};

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

export const notifyWarning = (warning:string) => {
  toast.warn(warning, {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    });
}

export const generateTXT = (transcription:string) => {
  const blob = new Blob([transcription], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'transcription.txt';

  a.click();

  URL.revokeObjectURL(url);
}