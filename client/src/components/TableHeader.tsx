import { Link } from "react-router-dom"

export const TableHeader = ():JSX.Element => {
  return (
    <div className='flex justify-between px-7 pt-9'>
      <div className='text-left'>
        <h1 className='font-bold text text-slate-300 text-4xl'>Files</h1>
        <h1 className='font-light text-slate-400 text-xl'>All your transcriptions in one place</h1>
      </div>
      <Link to={"/upload"}><button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold border border-gray-400 rounded shadow text-xs h-8 w-20">Upload</button></Link>
    </div>
  )
}