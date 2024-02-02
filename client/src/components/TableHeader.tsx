import { calculateNewValue } from "@testing-library/user-event/dist/utils"
import { UpdateFileCallback } from "../App"

type TableHeaderProps = {
  callback: UpdateFileCallback
}

export const TableHeader:React.FC<TableHeaderProps> = ({callback}):JSX.Element => {
  return (
    <div className='flex justify-between'>
        <div className='text-left'>
          <h1 className='font-bold text text-slate-300 text-3xl'>Files</h1>
          <h1 className='font-light text-slate-400'>All your transcriptions in one place</h1>
        </div>
        <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold border border-gray-400 rounded shadow text-xs h-8 w-20"
                onClick={callback}>
          Upload
        </button>
      </div>
  )
}