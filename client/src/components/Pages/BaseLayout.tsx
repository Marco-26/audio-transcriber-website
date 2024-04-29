import React, { Dispatch, SetStateAction } from 'react'
import { User } from '../../shared/User';
import { Header } from '../Header';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer';

interface BaseLayoutProps{
  user:User | undefined;
}

const BaseLayout:React.FC<BaseLayoutProps> = ({user}) => {
  return (
    <div>
      <Header user={user}/>
      <Outlet/>
    </div>
  )
}

export default BaseLayout