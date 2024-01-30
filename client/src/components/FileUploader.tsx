import './FileUploader.css'
import { processUpload } from '../utils/api-client'
import { AxiosError } from 'axios';
import {useState, ChangeEvent, useRef} from 'react'
import {UpdateMessageCallback} from '../App'
import {formatFileSize} from '../utils/utils'

interface FileUploaderProps{
  setMessageCallback: UpdateMessageCallback
}

export const FileUploader = ({setMessageCallback} : FileUploaderProps):JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (event.target.files) {
      console.log(event.target.files[0])
      //TODO: Verificar tipo de ficheiro antes de enviar
      console.log("Tipo de ficheiro: " + event.target.files[0].type)
      setFile(event.target.files[0])
    }
  }

  const handleInput = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (event:React.FormEvent) => {
    event.preventDefault()
    if(!file){
      console.error("No file selected")
      return
    }
    
    //TODO: Place these in python script
    setMessageCallback("\nSaving the file")
    setMessageCallback("\nStarting transcription")
    setMessageCallback("\nThis might take awhile...")

    processUpload(file, 
      (message:string) => {setMessageCallback("\nTranscription:\n"+message)}, 
      (error:AxiosError) => {setMessageCallback("\nError: " + error)})
  }

  return (
    <>
      <div className="container">
        <div className="card">
          <h3>Upload Files</h3>
          <div className="drop_box">
            <header>
              {file ? (
                <>
                  <h4>File: {file!.name}</h4>
                  <h4>Size: {formatFileSize(file.size)}</h4>
                </>
              ) : (<h4>Select File here</h4>)}
            </header>
            <p>Files Supported: MP3</p>
            <input type="file" id="fileInput" style={{display:"none"}}onChange={handleFileChange}/>
            <label htmlFor="fileInput" className='btn' onClick={handleInput}>Choose File</label>
          </div>
        </div>
      </div>
      <button type='submit' className='btn btn-upload' onClick={handleFileUpload} disabled={file ? false : true}>Upload</button>
    </>
  );
}
