import './FileUploader.css'
import { processUpload } from '../utils/api-client'
import { AxiosError } from 'axios';
import {useState, ChangeEvent, useRef} from 'react'

interface FileUploaderProps{
  setMessageCallback: (message:string) => void
}

export const FileUploader = ({setMessageCallback} : FileUploaderProps):JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (event.target.files) {
      console.log(event.target.files[0])
      setFile(event.target.files[0])
    }
  }

  const handleInput = () =>{
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (event:React.FormEvent) => {
    event.preventDefault()
    if(!file){
      console.error("No file selected")
      return
    }

    processUpload(file, 
      (message:string) => {setMessageCallback(message)}, 
      (error:AxiosError) => {setMessageCallback("Error: " + error)})
  }
      
  return (
    <>
      <div className="container">
        <div className="card">
          <h3>Upload Files</h3>
          <div className="drop_box">
            <header>
              {file ? (<h4>File: {file!.name}</h4>) : (<h4>Select File here</h4>)}
            </header>
            <p>Files Supported: MP3</p>
            <input type="file" id="fileInput" style={{display:"none"}}onChange={handleFileChange}/>
            <label htmlFor="fileInput" className='btn' onClick={handleInput}>Choose File</label>
          </div>
        </div>
      </div>
      <button type='submit' className='btn btn-upload' onClick={handleFileUpload}>Upload</button>
    </>
  );
}
