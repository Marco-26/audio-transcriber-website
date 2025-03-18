import { Dispatch, SetStateAction } from "react";
import { User } from "../types/User";
import { Header } from "../components/Header"
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