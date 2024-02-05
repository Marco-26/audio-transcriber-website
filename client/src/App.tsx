import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css'
import { FileToTranscribe } from './shared/FileType';
import { Index } from './pages/Index'
import { Upload } from './pages/Upload'
import { Header } from './components/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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
    <div className='bg-gray-900 h-screen'>
      <Router> 
        <Header/>
          <Routes>
            <Route path="/" element={<Index/>} />
            <Route path="/upload" element={<Upload/>} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
