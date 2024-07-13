import { FileEntry } from '@/src/Types/FileEntry';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import TableHeader from '../TableHeader';
import { TranscriptionsTable } from '../TranscriptionsTable';
import { User } from '@/src/Types/User';
import { Header } from '../Header';
import UserApi from "../../api/user"

interface HomeProps {
  user:User | undefined; 
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

const Home:React.FC<HomeProps> = ({user,setUser}) => {
  const [files, setFiles] = useState<FileEntry[] | undefined>([]);

  useEffect(() => {
    const fetchUser = async () => {
      UserApi.fetchProfile().then((response) => setUser(response)).catch((error) => console.error(error))
    };

    fetchUser();
  }, [setUser]);

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