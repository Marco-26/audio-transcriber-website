import React, { useState } from 'react';
import './styles/globals.css'
import { FileInfo } from './shared/FileType';

import { TranscriptionsTable } from './components/TranscriptionsTable';
import TableHeader from './components/TableHeader';
import { Header } from './components/Header';

function App() {
  const [file, setFile] = useState<File>();
  const [fileInfo, setFileInfo] = useState<FileInfo>();

  // useEffect(() => {
  //   const handleBeforeUnload = (event:any) => {
  //     event.preventDefault();
  //     event.returnValue = '';
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  return (
    <div>
      <Header/>
      <div className="px-6 py-5 ">
        <TableHeader setFile={setFile} setFileInfo={setFileInfo}/>
        <TranscriptionsTable fileInfo={fileInfo} file={file!} />
      </div>
    </div>

  );
}

export default App;
