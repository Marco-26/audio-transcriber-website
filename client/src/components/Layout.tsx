import { Dispatch, SetStateAction } from "react";
import { User } from "../Types/User";
import { Header } from "./Header"
import { Outlet } from "react-router-dom";

interface LayoutProps{
  user:User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

const Layout:React.FC<LayoutProps> = ({user, setUser}) => {
  return(
    <>
      <Header user={user} setUser={setUser}/>
      <Outlet/>
    </>
  )
}

export default Layout