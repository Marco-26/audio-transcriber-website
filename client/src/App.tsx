import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css'
import { Upload } from './pages/Upload'
import { Header } from './components/Header';
import { FileInfo } from './shared/FileType';
import { UploadStatus } from './utils/utils';
import { Table } from "./components/Table";

function App() {
  const [file, setFile] = useState<File>()
  const [fileInfo, setFileInfo] = useState<FileInfo>()
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>()

  useEffect(() => {
    const handleBeforeUnload = (event:any) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className='bg-gray-900 h-screen'>
      <Header />
      <Upload file={file!} setFile={setFile} fileInfo={fileInfo!} setFileInfo={setFileInfo} setUploadStatus={setUploadStatus}/>
      <Table fileInfo={fileInfo} file={file!} uploadStatus={uploadStatus!}/>
    </div>
  );
}

export default App;
