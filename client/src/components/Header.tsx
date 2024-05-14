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
  User as UserIcon,
} from "lucide-react"
import { Button } from "./UI/Button";
import { User } from '../shared/User';
import axios, { AxiosResponse, AxiosError } from 'axios';

type HeaderProps={
  user:User | undefined;
}

export const Header:React.FC<HeaderProps> = ({user}):JSX.Element => {
  
  const handleLogin = async () => {
    console.log("TEST")
    
    axios.get('https://127.0.0.1:5000/login')
      .then((res:AxiosResponse) => {
        window.location.assign(res.data.request_uri);
      })
      .catch((err: AxiosError) => console.log(err));
  }


  return (
    <header className="sticky flex justify-between top-0 h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
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
      </div>
      <div className="ml-auto">
          {!user ? 
              <Button onClick={handleLogin}>
                <UserIcon className='mr-2'/>
                Login
              </Button>
          : 
            <div className="flex w-full items-center gap-4 md:gap-2 lg:gap-4">
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
        </div>
    </header>
  )
}