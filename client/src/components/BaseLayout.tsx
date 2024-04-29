import React, { Dispatch, SetStateAction } from 'react'
import { User } from '../shared/User';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';

interface BaseLayoutProps{
  user:User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

const BaseLayout:React.FC<BaseLayoutProps> = ({user, setUser}) => {
  return (
    <div>
      <Header user={user} setUser={setUser}/>
      <Outlet/>
    </div>
  )
}

export default BaseLayout