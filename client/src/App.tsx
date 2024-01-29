import React, { ChangeEvent,  useState } from 'react';
import { AxiosError } from 'axios';
import { processUpload } from './utils/api-client'
import './App.css';

function App() {
  const [message, setMessage] = useState<string>("")
  const [file, setFile] = useState<File | null>(null);
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
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
      Resposta do servidor: {message}
      <form>
        <h1>File Transcriber</h1>
        <input type="file" onChange={handleFileChange}/>
        <button type='submit' onClick={handleFileUpload}>Upload</button>
      </form>
    </div>
  );
}

export default App;
