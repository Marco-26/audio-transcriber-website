import '../../index.css'

export const Table = ():JSX.Element => {
  return (
    <div className='mt-5 dark'>
      <div className='flex justify-between'>
        <div className='text-left'>
          <h1 className='font-bold text text-slate-300 text-xl'>Files</h1>
          <h1 className='font-light text-slate-400'>All your transcriptions in one place</h1>
        </div>
        <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold border border-gray-400 rounded shadow text-xs h-8 w-20">
          Upload
        </button>
      </div>
      <div className="relative overflow-x-auto mt-5">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-800 dark:text-gray-400 border border-gray-700 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              File
            </th>
            <th scope="col" className="px-6 py-3">
              Duration
            </th>
            <th scope="col" className="px-6 py-3">
              Size
            </th>
            <th scope="col" className="px-6 py-3">
              Transcription
            </th>
            <th scope="col" className="">
              Share
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b dark:bg-slate-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              video.mp3
            </th>
            <td className="px-6 py-4">10:05</td>
            <td className="px-6 py-4">20MB</td>
            <td className="px-6 py-4">Processing...</td>
            <td className="">Send</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  )
}