import React, { useState } from 'react';
import './App.css';
import './index.css'
import { Index } from './pages/Index'
import { Upload } from './pages/Upload'
import { Header } from './components/Header';
import { Route, Routes } from 'react-router-dom';
import { FileInfo } from './shared/FileType';

function App() {
  const [file, setFile] = useState<File>()
  const [fileInfo, setFileInfo] = useState<FileInfo>()
  const [transcription, setTranscription] = useState<string>()

  return (
    <div className='bg-gray-900 h-screen'>
        <Header />
        <Routes>
          <Route path="/" element={<Index file={file}/>} />
          <Route path="/upload" element={<Upload file={file} setFile={setFile} fileInfo={fileInfo} setFileInfo={setFileInfo}/>} />
        </Routes>
    </div>
  );
}

export default App;
