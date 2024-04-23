import { FileInfo } from '@/src/shared/FileType';
import React, { useState } from 'react'
import TableHeader from '../TableHeader';
import { TranscriptionsTable } from '../TranscriptionsTable';

function Home() {
  const [files, setFiles] = useState<FileInfo[] | undefined>([]);

  return (
    <div className="px-6 py-5 ">
        <TableHeader files={files} setFiles={setFiles}/>
        <TranscriptionsTable files={files!} setFiles={setFiles}/>
      </div>
  )
}

export default Home