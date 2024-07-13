import { FileEntry } from '@/src/shared/Types';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import TableHeader from '../TableHeader';
import { TranscriptionsTable } from '../TranscriptionsTable';
import { User } from '@/src/shared/User';
import { Header } from '../Header';
import { fetchProfile } from '../../utils/api-client';

interface HomeProps {
  user:User | undefined; 
  setUser: Dispatch<SetStateAction<User | undefined>>;
}
const Home:React.FC<HomeProps> = ({user,setUser}) => {
  const [files, setFiles] = useState<FileEntry[] | undefined>([]);

  const fetch = async () => {
    const user = await fetchProfile((message) => console.log(message), (error) => console.error(error));
    if(user != null){
      setUser(user);
    }
  }

  useEffect(() => {
    fetch();
  }, []);
  
  return (
    <>
      <Header user={user} setUser={setUser}/>
      <div className="px-6 py-5">
        <TableHeader user={user} files={files} setFiles={setFiles}/>
        <TranscriptionsTable user={user} files={files!} setFiles={setFiles}/>
      </div>
    </>
  )
}

export default Home;