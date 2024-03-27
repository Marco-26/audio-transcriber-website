import '../index.css'
import React, { useState } from 'react';
import { processTranscription } from '../utils/api-client';
import { error } from 'console';
import { FileInfo } from '../shared/FileType';
import { formatFileSize } from '../utils/utils';

type TableProps = {
  fileInfo?:FileInfo,
  file:File
}

export const FileTable:React.FC<TableProps> = ({fileInfo,file}):JSX.Element => {
  const [startedTranscription, setStartedTranscription] = useState<Boolean>(false)
  const [finishedTranscription, setFinishedTranscription] = useState<Boolean>(false)
  const [transcription, setTranscription] = useState<string>()
  
  const handleTranscription = async () => {
    setStartedTranscription(true)

    await processTranscription(file!, 
      (message) => setTranscription(message), 
      (error) => console.error(error))
      
    setFinishedTranscription(true)
  }

  const handleDownload = () => {
    if (transcription) {
      // Create a new Blob with the transcription content
      const blob = new Blob([transcription], { type: 'text/plain' });
      
      // Create a temporary URL for the Blob
      const url = URL.createObjectURL(blob);
  
      // Create an anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transcription.txt'; // Set the filename here
  
      // Trigger a click on the anchor element to start the download
      a.click();
  
      // Clean up the temporary URL
      URL.revokeObjectURL(url);
    } else {
      console.error('No transcription available');
    }
  };

  return (
    <div>
      <div className="relative overflow-x-auto mt-5">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 bg-slate-800 text-gray-400 border border-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Size
            </th>
            <th scope="col" className="px-6 py-3">
              Upload status
            </th>
            <th scope="col" className="px-6 py-3">
              Transcription
            </th>
            <th scope="col" className="px-6 py-3">
              Download
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-700">
            {fileInfo ?
              <>
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                  {fileInfo.name}
                </th>
                <td className="px-6 py-4">{formatFileSize(fileInfo.size)}</td>
                <td className="px-6 py-4">{fileInfo.uploadStatus}</td>
                {finishedTranscription ? (
                  <td className="px-6 py-4">Finished</td>
                ) : (
                  startedTranscription ? (
                    <td className="px-6 py-4">Processing</td>
                  ) : (
                    <td className="px-6 py-4">
                      <button 
                        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold border border-gray-400 rounded shadow text-xs h-8 w-20" 
                        onClick={handleTranscription}
                      >
                        Start
                      </button>
                    </td>
                  )
                )}
                <td className="px-6 py-4"><button className="hover:bg-gray-100 text-gray-800 font-semibold border border-gray-400 rounded shadow text-xs h-8 w-20" style={!finishedTranscription ? {backgroundColor:"#939393"} : {backgroundColor:"white"}} onClick={handleDownload} disabled={!finishedTranscription}>Download</button></td>
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