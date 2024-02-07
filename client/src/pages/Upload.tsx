import { ChangeEvent, useRef, useState } from "react"
import { ToastContainer } from 'react-toastify';
import { generateFileInfo, notifyError } from "../utils/utils";
import { Dispatch, SetStateAction } from "react"
import { UploadTable as Table } from "../components/UploadTable";
import { FileToTranscribe } from "../shared/FileType";
import { AxiosError } from "axios";
import { processUpload } from "../utils/api-client";

interface UploadProps {
  setFile: Dispatch<SetStateAction<File | undefined>>;
}

export const Upload: React.FC<UploadProps> = ({ setFile }): JSX.Element => {
  const [fileInfo, setFileInfo] = useState<FileToTranscribe>()
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (event.target.files) {
      const file: File = event.target.files[0];
      if (file.type !== "audio/mpeg") {
        notifyError("File type not supported...");
        return;
      }
      setFile(file)
      setFileInfo(generateFileInfo(file))
      handleFileUpload(file)
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
      <h1 className='font-bold text text-slate-300 text-2xl'>Upload</h1>
      <button className="w-full border border-gray-700 rounded-md h-24 mt-3 bg-gray-800"
        onClick={() => { inputRef.current?.click() }}>
        <p>Select your files here</p>
        <p className="text-xs">Files supported: MP3</p>
      </button>
      <input type="file" id="file" className="invisible" ref={inputRef} onChange={handleFileChange} />
      <Table file={fileInfo} />
    </div>
  )
}