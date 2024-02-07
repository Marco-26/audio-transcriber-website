import '../index.css'
import { FileToTranscribe } from '../shared/FileType'

type TableProps = {
  file?:FileToTranscribe
}

export const TranscriptionTable:React.FC<TableProps> = ({file}):JSX.Element => {
  return (
    <div className='px-7'>
      <div className="relative overflow-x-auto mt-5">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 bg-slate-800 text-gray-400 border border-gray-700">
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
          <tr className="border-b border-gray-700">
            {file ?
              <>
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                  {file.name}
                </th>
                <td className="px-6 py-4">{file.duration}</td>
                <td className="px-6 py-4">{file.size} MB</td>
                <td className="px-6 py-4">{file.transcriptionStatus === "Processing" ? "Processing" : "Ready"}</td>
                <td className="">Send</td>
              </>
            :
              <div className='p-3'>No file uploaded</div>
            }
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  );
}