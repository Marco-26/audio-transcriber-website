import { FileInfo } from '@/src/shared/FileType';
import React, { useState } from 'react'
import TableHeader from '../TableHeader';
import { TranscriptionsTable } from '../TranscriptionsTable';
import { User } from '@/src/shared/User';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { UserIcon } from 'lucide-react';
import { Button } from '../UI/Button';

interface HomeProps {
  user:User | undefined; 
}
const Home:React.FC<HomeProps> = ({user}) => {
  const [files, setFiles] = useState<FileInfo[] | undefined>([]);
  
  const handleLogin = async () => {
    console.log("TEST")
    
    axios.get('/login')
      .then((res:AxiosResponse) => {
        console.log(res.data.auth_url)
        window.location.assign(res.data.auth_url);
      })
      .catch((err: AxiosError) => console.log(err));
  }
  
  return (
    <div className="px-6 py-5">
        
        <Button onClick={handleLogin}>
          <UserIcon className='mr-2'/>
          Login
        </Button>

        <TableHeader user={user} files={files} setFiles={setFiles}/>
        <TranscriptionsTable files={files!} setFiles={setFiles}/>
      </div>
  )
}

export default Home