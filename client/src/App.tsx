import React, { useState } from 'react';
import './styles/globals.css'

import { Header } from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Pages/Login';
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header  user={user}/>}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
          </Route>
        </Routes>
    </BrowserRouter>
      
    </div>
  );
}

export default App;
