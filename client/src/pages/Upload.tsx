import { ChangeEvent, useEffect, useRef } from "react"
import { ToastContainer } from 'react-toastify';
import { generateFileInfo, notifyError } from "../utils/utils";
import { Dispatch, SetStateAction } from "react"
import { UploadTable as Table } from "../components/UploadTable";
import { FileInfo } from "../shared/FileType";
import { AxiosError } from "axios";
import { processUpload } from "../utils/api-client";
import { Link } from 'react-router-dom'

interface UploadProps {
  file:File | undefined;
  setFile: Dispatch<SetStateAction<File | undefined>>;
  fileInfo:FileInfo | undefined;
  setFileInfo: Dispatch<SetStateAction<FileInfo | undefined>>;
}

export const Upload: React.FC<UploadProps> = ({ file, setFile, fileInfo, setFileInfo }): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (event.target.files) {
      const temp:File = event.target.files[0];
      if (temp.type !== "audio/mpeg") {
        notifyError("File type not supported...");
        return;
      }
      setFile(temp)
      setFileInfo(generateFileInfo(temp))
      handleFileUpload(temp)
    }
  }

  const handleFileUpload = async (file: File) => {
    await processUpload(file,
      (message: string) => {
        console.log("\n" + message)
        setFileInfo((prevFileInfo) => {
          if (prevFileInfo) {
            return { ...prevFileInfo, uploadStatus: "Uploaded" };
          }
          return prevFileInfo;
        });
      },
      (error: AxiosError) => {
        console.error("\nError: " + error)
        setFileInfo((prevFileInfo) => {
          if (prevFileInfo) {
            return { ...prevFileInfo, uploadStatus: "Error" };
          }
          return prevFileInfo;
        });
      })
  }

  return (
    <div className='px-7 mt-4'>
      <div className="flex justify-between">
        <h1 className='font-bold text text-slate-300 text-2xl'>Upload</h1>
        <Link to={"/"}><button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold border border-gray-400 rounded shadow text-xs h-8 w-20 disabled:opacity-75" disabled={!file}>Create</button></Link>
      </div>
      <button className="w-full border border-gray-700 rounded-md h-24 mt-3 bg-gray-800"
        onClick={() => { inputRef.current?.click() }}>
        <p>Select your files here</p>
        <p className="text-xs">Files supported: MP3</p>
      </button>
      <input type="file" id="file" className="invisible" ref={inputRef} onChange={handleFileChange} />
      <Table file={fileInfo} />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  )
}