import React, { useState } from 'react';
import './styles/globals.css'

import { Header } from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Pages/Home';
import { User } from './shared/User';

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
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
      <Header user={user}/>
      <Home user={user}/>
    </div>
  );
}

export default App;
