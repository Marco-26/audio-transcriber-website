import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css'
import { FileToTranscribe } from './shared/FileType';
import { Index } from './pages/Index'
import { Upload } from './pages/Upload'
import { Header } from './components/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [file, setFile] = useState<File>()

  return (
    <div className='bg-gray-900 h-screen'>
      <Router> 
        <Header/>
          <Routes>
            <Route path="/" element={<Index/>} />
            <Route path="/upload" element={<Upload setFile={setFile}/>} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
