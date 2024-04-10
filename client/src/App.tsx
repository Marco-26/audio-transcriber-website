import React, { useEffect, useState } from 'react';
import './styles/globals.css'

import { FileInfo } from './shared/FileType';
import { UploadStatus } from './utils/utils';

import { TranscriptionsTable } from './components/TranscriptionsTable';
import TableHeader from './components/TableHeader';
import { Header } from './components/Header';

function App() {
  const [file, setFile] = useState<File>();
  const [fileInfo, setFileInfo] = useState<FileInfo>();
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>();

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
    <div>
      <Header file={file} setFile={setFile} fileInfo={fileInfo} setFileInfo={setFileInfo} setUploadStatus={setUploadStatus}/>
      <div className="px-6 py-5 ">
        <TableHeader/>
        <TranscriptionsTable fileInfo={fileInfo} file={file!} uploadStatus={uploadStatus!}/>
      </div>
    </div>

  );
}

export default App;
