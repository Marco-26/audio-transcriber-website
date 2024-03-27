import React, { useState } from 'react';
import './App.css';
import './index.css'
import { Upload } from './pages/Upload'
import { Header } from './components/Header';
import { FileInfo } from './shared/FileType';

function App() {
  const [file, setFile] = useState<File>()
  const [fileInfo, setFileInfo] = useState<FileInfo>()

  return (
    <div className='bg-gray-900 h-screen'>
        <Header />
        <Upload file={file!} setFile={setFile} fileInfo={fileInfo!} setFileInfo={setFileInfo} />
    </div>
  );
}

export default App;
