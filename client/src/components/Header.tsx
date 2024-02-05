import { Link } from 'react-router-dom'
import '../index.css'

export const Header = ():JSX.Element => {
  return (
    <nav className="border-b border-gray-700 p-4 px-7">
      <div className="flex flex-wrap items-center justify-between mx-auto ">
        <a href="" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-slate-300">Transcribify</span>
        </a>
        <Link to={"/upload"}><button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold border border-gray-400 rounded shadow text-xs h-8 w-20">Upload</button></Link>
      </div>
    </nav>
  )
}