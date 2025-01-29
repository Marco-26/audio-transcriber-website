import { GoogleOAuthProvider } from '@react-oauth/google';
import Auth from './auth/Auth';
import { User } from '../types/User';
import { Dispatch, SetStateAction } from 'react';

interface LoginButtonProps {
  user:User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

const id:string | undefined = process.env.REACT_APP_GOOGLE_CLIENT_ID;

if (!id) {
  throw new Error('REACT_APP_GOOGLE_CLIENT_ID is not set');
}

export const LoginButton:React.FC<LoginButtonProps> = ({user,setUser}) => {
  return (
    <GoogleOAuthProvider clientId={id}>
      <Auth user={user} setUser={setUser}/>
    </GoogleOAuthProvider>
  );
}