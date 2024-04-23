import { FileInfo } from '@/src/shared/FileType';
import React, { useState } from 'react'
import TableHeader from '../TableHeader';
import { TranscriptionsTable } from '../TranscriptionsTable';
import { User } from '@/src/shared/User';

interface HomeProps {
  user:User | undefined; 
}
const Home:React.FC<HomeProps> = ({user}) => {
  const [files, setFiles] = useState<FileInfo[] | undefined>([]);

  return (
    <div className="px-6 py-5">
        <TableHeader user={user} files={files} setFiles={setFiles}/>
        <TranscriptionsTable files={files!} setFiles={setFiles}/>
      </div>
  )
}

export default Home