import {
  FileVolume
} from "lucide-react"
import { User } from '../Types/User';
import { Dispatch, SetStateAction } from 'react';
import { LoginButton } from "./LoginButton";

interface HeaderProps {
  user:User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
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
        <LoginButton user={user} setUser={setUser}/>
      </div>
    </header>
  )
}