import React, { useState } from 'react';
import './styles/globals.css'
import { FileInfo } from './shared/FileType';

import { TranscriptionsTable } from './components/TranscriptionsTable';
import TableHeader from './components/TableHeader';
import { Header } from './components/Header';

function App() {
  const [files, setFiles] = useState<FileInfo[] | undefined>([]);

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
        <TableHeader files={files} setFiles={setFiles}/>
        <TranscriptionsTable files={files!} setFiles={setFiles}/>
      </div>
    </div>

  );
}

export default App;
