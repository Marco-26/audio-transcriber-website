import React, { useEffect, useState } from 'react';
import './styles/globals.css'

import Home from './components/Pages/Home';
import { User } from './shared/User';

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  
  useEffect(() => {
    const handleBeforeUnload = (event:any) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
      <Home user={user} setUser={setUser}/>
  );
}

export default App;
