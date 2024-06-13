import { FileInfo } from '@/src/shared/FileType';
import React, { Dispatch, SetStateAction, useState } from 'react'
import TableHeader from '../TableHeader';
import { TranscriptionsTable } from '../TranscriptionsTable';
import { User } from '@/src/shared/User';
import { Header } from '../Header';

interface HomeProps {
  user:User | undefined; 
  setUser: Dispatch<SetStateAction<User | undefined>>;
}
const Home:React.FC<HomeProps> = ({user,setUser}) => {
  const [files, setFiles] = useState<FileInfo[] | undefined>([]);

  return (
    <>
      <Header user={user} setUser={setUser}/>
      <div className="px-6 py-5">
        <TableHeader user={user} files={files} setFiles={setFiles}/>
        <TranscriptionsTable files={files!} setFiles={setFiles}/>
      </div>
    </>
  )
}

export default Home;