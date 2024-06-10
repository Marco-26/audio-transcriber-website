import React, { Dispatch, SetStateAction, useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import IconButton from "@mui/material/IconButton";
import { useGoogleLogin } from "@react-oauth/google";
import { User } from "@/src/shared/User";
import { Button } from "../UI/Button";
import { CircleUser, UserIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../UI/Dropdown";

async function getUserInfo(codeResponse:any) {
  var response = await fetch("/google_login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: codeResponse.code }),
  });
  return await response.json();
}

async function getProtected() {
  var response = await fetch("/protected", {
    method: "GET",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((msg) => console.log(msg));
}

interface AuthProps{
  user:User | undefined; 
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

const Auth:React.FC<AuthProps> = ({user,setUser}) => {
  const [loggedIn, setLoggedIn] = useState(false);
  
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      var loginDetails = await getUserInfo(codeResponse);
      
      const mappedUser: User = {
        id: loginDetails.user.sub,
        name: loginDetails.user.name,
        email: loginDetails.user.email,
        picture: loginDetails.user.picture,
      };
      
      setLoggedIn(true);
      setUser(mappedUser);
    },
  });

  const handleLogout = () => {
    getProtected();
    setLoggedIn(false);
  };

  return (
    <>
      {!loggedIn ? (
        <Button onClick={() => googleLogin()}>
          <UserIcon className='mr-2'/>
          Login
        </Button>
      ) : (
        <>
          <div className="flex w-full items-center gap-4 md:gap-2 lg:gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className='flex items-center'>
                    <p className="mr-4">{user!.name}</p>
                    <Button variant="secondary" size="icon" className="rounded-full mr-3">
                      <CircleUser className="h-5 w-5" />
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleLogout()}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
        </>
        // <UserAvatar userName={user.name} onClick={handleLogout}></UserAvatar>
      )}
    </>
  );
}

export default Auth;