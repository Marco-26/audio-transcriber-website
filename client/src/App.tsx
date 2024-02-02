import React, { useEffect, useState } from 'react';
import { Header } from './components/Header'

import './App.css';
import './index.css'
import { Table } from './components/Table';
import { FileToTranscribe } from './shared/FileType';
import { TableHeader } from './components/TableHeader';

export type UpdateFileCallback = () => void;

function App() {
  const [file, setFile] = useState<FileToTranscribe>()

  const setFileCallback:UpdateFileCallback = () => {
    const testFile:FileToTranscribe = {
      name: "Video.mp3",
      duration:"12:05",
      size:19.2,
      status: "Processing"
    }
    setFile(testFile)
  }

  return (
    <div className="App">
        <Header/>
      <div className='px-7 py-3'>
        <TableHeader callback={setFileCallback}/>
        <Table file={file}/>
      </div>
    </div>
  );
}

export default App;
