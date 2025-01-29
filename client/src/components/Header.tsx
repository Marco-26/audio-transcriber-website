import {
  FileVolume
} from "lucide-react"
import { User } from '../types/User';
import { Dispatch, SetStateAction } from 'react';
import { LoginButton } from "./LoginButton";
import { Link } from "react-router-dom";

interface HeaderProps {
  user:User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

export const Header:React.FC<HeaderProps> = ({user,setUser}):JSX.Element => {
  return (
    <header className="flex justify-between top-0 h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <div className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <FileVolume />
          </div>
          <Link
            to="/"
            className="text-foreground transition-colors hover:text-foreground"
          >
            AudioTranscriberAI
          </Link>
          {user ? (
            <Link
              to="/dashboard"
              className={"text-foreground transition-colors hover:text-foreground text-gray"}
            >
              Dashboard
            </Link>
          ) : (
            <span className="text-gray opacity-50 cursor-default">Dashboard</span>
          )}
      </div>
      <div className="ml-auto">
        <LoginButton user={user} setUser={setUser}/>
      </div>
    </header>
  )
}