import './FileUploader.css'
import {ChangeEvent, useRef} from 'react'

type FileUploaderProps = {
  onFileChange: (file:File) => void
  onFileUpload: (event:React.FormEvent) => void
}

export const FileUploader:React.FC<FileUploaderProps> = ({onFileChange, onFileUpload}):JSX.Element => {
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (event.target.files) {
      onFileChange(event.target.files[0])
    }
  }

  const handleInput = () =>{
    fileInputRef.current?.click()
  }
      
  return (
    <>
      <div className="container">
        <div className="card">
          <h3>Upload Files</h3>
          <div className="drop_box">
            <header>
              <h4>Select File here</h4>
            </header>
            <p>Files Supported: MP3</p>
            <input type="file" id="fileInput" style={{display:"none"}}onChange={handleFileChange}/>
            <label htmlFor="fileInput" className='btn' onClick={handleInput}>Choose File</label>
          </div>
        </div>
      </div>
      <button type='submit' className='btn btn-upload' onClick={onFileUpload}>Upload</button>
    </>
  );
}
