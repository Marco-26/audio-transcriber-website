import React, {   useState } from 'react';
import { AxiosError } from 'axios';
import { processUpload } from './utils/api-client'
import { FileUploader } from './components/FileUploader'
import './App.css';

function App() {
  const [message, setMessage] = useState<string>("")
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (file:File) => {
    setFile(file)
  }

  const handleFileUpload = async (event:React.FormEvent) => {
    event.preventDefault()
    if(!file){
      console.error("No file selected")
      return
    }

    processUpload(file, 
      (message:string) => {setMessage(message)}, 
      (error:AxiosError) => {setMessage("Error: " + error)})
  }

  return (
    <div className="App">
      <form>
        <h1>File Transcriber</h1>
        <FileUploader onFileChange={handleFileChange} onFileUpload={handleFileUpload}/>
      </form>
      <p>Selected file: {file?.name}</p>
      Resposta do servidor: {message}
    </div>
  );
}

export default App;
