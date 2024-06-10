import {
  Package2,
} from "lucide-react"
import { User } from '../shared/User';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Auth from './auth/Auth';
import { Dispatch, SetStateAction } from 'react';

type HeaderProps={
  user:User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

export const Header:React.FC<HeaderProps> = ({user,setUser}):JSX.Element => {
  
  return (
    <header className="sticky flex justify-between top-0 h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <div className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Package2 className="h-6 w-6" />
          </div>
          <h1>AITranscriber</h1>
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
            <GoogleOAuthProvider clientId="502165279743-etiji55b53qgm032m5j69vcc56i14k94.apps.googleusercontent.com">
              <Auth user={user} setUser={setUser}/>
            </GoogleOAuthProvider>
        </div>
    </header>
  )
}