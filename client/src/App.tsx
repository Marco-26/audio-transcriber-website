import React, { useState } from 'react';
import { FileUploader } from './components/FileUploader'
import { Header } from './components/header/Header'

import './App.css';
import './index.css'
import { Table } from './components/table/Table';

export type UpdateMessageCallback = (newMessage:string) => void;

function App() {
  const [message, setMessage] = useState<string>("")
  
  const updateMessage: UpdateMessageCallback = (newMessage:string) => {
    setMessage((prev) => prev + newMessage);
  }

  return (
    <div className="App p-7">
      <Header/>
      <Table/>
      {/* <FileUploader setMessageCallback={updateMessage}/> */}
    </div>
  );
}

export default App;
