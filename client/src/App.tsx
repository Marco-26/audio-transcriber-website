import React, { useState } from 'react';
import { FileUploader } from './components/FileUploader'
import { Output } from './components/Output'
import './App.css';

function App() {
  const [message, setMessage] = useState<string>("")

  return (
    <div className="App">
      <form>
        <h1>File Transcriber</h1>
        <FileUploader setMessageCallback={setMessage}/>
      </form>
      <Output children={"Teste"}></Output>
    </div>
  );
}

export default App;
