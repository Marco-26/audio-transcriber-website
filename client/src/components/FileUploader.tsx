import './FileUploader.css'
import { processUpload } from '../utils/api-client'
import { AxiosError } from 'axios';
import {useState, ChangeEvent, useRef} from 'react'
import {formatFileSize, notifyError} from '../utils/utils'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const FileUploader = ():JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null);
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (event.target.files) {
      const file:File = event.target.files[0];
      if(file.type !== "audio/mpeg"){
        notifyError("File type not supported...");
        return;
      }
      setFile(event.target.files[0])
    }
  }

  const handleFileUpload = async (event:React.FormEvent) => {
    event.preventDefault()
    if(!file){
      console.error("No file selected")
      return
    }

    // await processUpload(file, 
    //   (message:string) => {setMessageCallback("\n"+message)}, 
    //   (error:AxiosError) => {setMessageCallback("\nError: " + error)})
  }

  return (
    <>
      <div className="container">
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
