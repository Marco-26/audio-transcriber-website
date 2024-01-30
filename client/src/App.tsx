import React, { useState } from 'react';
import { FileUploader } from './components/FileUploader'
import { Output } from './components/Output'
import './App.css';

export type UpdateMessageCallback = (newMessage:string) => void;

function App() {
  const [message, setMessage] = useState<string>("")

  const updateMessage: UpdateMessageCallback = (newMessage:string) => {
    setMessage((prev) => prev + newMessage);
  }

  return (
    <div className="App">
      <form>
        <h1>File Transcriber</h1>
        <FileUploader setMessageCallback={updateMessage}/>
      </form>
      <Output>{message}</Output>
    </div>
  );
}

export default App;
