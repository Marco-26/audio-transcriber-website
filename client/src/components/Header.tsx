import { BrowserRouter as Router,  Link, Route, Routes } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./UI/Dropdown"
import {
  CircleUser,
  Package2,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./UI/Sheet";
import { Button } from "./UI/Button";
import { User } from '../shared/User';
import { Dispatch, SetStateAction } from 'react';
import LoginForm from './LoginForm';

type HeaderProps={
  user:User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

export const Header:React.FC<HeaderProps>= ({user,setUser}):JSX.Element => {
  return (
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <div className="flex items-center gap-2 text-lg font-semibold md:text-base">
              <Package2 className="h-6 w-6" />
            </div>
            
            <Link
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
            </Link>

          {!user ? 
          <Link to="login">
            <Button>LogIn</Button>
          </Link>
          : 
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className='flex items-center'>
                      <Button variant="secondary" size="icon" className="rounded-full mr-3">
                        <CircleUser className="h-5 w-5" />
                        <span className="sr-only">Toggle user menu</span>
                      </Button>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          }
      </nav>
    </header>
  )
}