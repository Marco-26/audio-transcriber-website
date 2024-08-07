import {
  Package2,
  FileVolume
} from "lucide-react"
import { User } from '../Types/User';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Auth from './auth/Auth';
import { Dispatch, SetStateAction } from 'react';

interface HeaderProps {
  user:User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

const id:string | undefined = process.env.REACT_APP_GOOGLE_CLIENT_ID;

if (!id) {
  throw new Error('REACT_APP_GOOGLE_CLIENT_ID is not set');
}

export const Header:React.FC<HeaderProps> = ({user,setUser}):JSX.Element => {
  return (
    <header className="sticky flex justify-between top-0 h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <div className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <FileVolume />
          </div>
          <h1>AudioTranscriberAI</h1>
          {/* <Link
            to="/"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            to="about"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link> */}
      </div>
      <div className="ml-auto">
            <GoogleOAuthProvider clientId={id}>
              <Auth user={user} setUser={setUser}/>
            </GoogleOAuthProvider>
        </div>
    </header>
  )
}