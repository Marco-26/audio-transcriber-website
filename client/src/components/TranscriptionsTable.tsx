import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getTranscriptionsEntries, processDelete, processTranscription } from '../utils/api-client';
import { FileInfo } from '../shared/FileType';
import { formatFileSize, generateFileInfo, generateTXT, updateFiles } from '../utils/utils';
import { Table,TableBody, TableCell, TableHead, TableHeader, TableRow } from './UI/Table';
import { Button } from './UI/Button';
import { Play, Trash, Download } from 'lucide-react';
import {removeFile} from '../utils/utils'
import { User } from '../shared/User';

type TableProps = {
  user:User|undefined;
  files:FileInfo[];
  setFiles: Dispatch<SetStateAction<FileInfo[] | undefined>>;
}

export const TranscriptionsTable:React.FC<TableProps> = ({user,files,setFiles}):JSX.Element => {
  const [startedTranscription, setStartedTranscription] = useState<boolean>(false)
  const [finishedTranscription, setFinishedTranscription] = useState<Boolean>(false)
  const [transcription, setTranscription] = useState<string>()
  
  const handleTranscription = async (file:FileInfo) => {
    setFinishedTranscription(false);
    setStartedTranscription(true);
    file.transcriptionStatus = "Processing...";
    
    await processTranscription(file.file!, 
      (message) => setTranscription(message), 
      (error) => console.error(error))
    
    setStartedTranscription(false)
    setFinishedTranscription(true)
    file.transcriptionStatus="Finished"
  }

  const handleDownload = (file:FileInfo) => {
    if (transcription) {
      generateTXT(transcription, file.transcriptionFileName!)
    } else {
      console.error('No transcription available');
    }
  };

  const handleDelete = async (file:FileInfo) => {
    if(!file){
      return;
    }

    await processDelete(file.name, 
      (message) => {
        const updatedFiles= removeFile(file.file!,files)
        setFiles(updatedFiles)
      }, 
      (error) => console.error(error))
  } 

  useEffect(() => {
    const fetchTranscriptions = async () => {
      if(user){
        const response = await getTranscriptionsEntries(
          user["id"],
          (message) => console.log(message), 
          (error) => console.error(error)
        );
        
        response.forEach(element => {
          const temp:FileInfo = {
            id:1,
            file:undefined,
            name:element.filename,
            size:10,
            date:new Date(),
            transcriptionStatus:"Finished",
            transcriptionFileName: ""
          }

          setFiles((prevFiles) => updateFiles(prevFiles!, temp));
        });
      };
    }
      
    fetchTranscriptions();
  }, [user]);

  return (
    <div className='border rounded'>
        <Table>
          <TableHeader>        
            <TableHead>Name</TableHead>
            <TableHead>Metadata</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Transcription Status</TableHead>
            <TableHead>Download</TableHead>
          </TableHeader>
          <TableBody>
            {files.map((file,index) => (
              <TableRow>
              {files ?
              <>
                <TableCell>
                  {file.name}
                </TableCell>
                <TableCell>{formatFileSize(file.size)}</TableCell>
                <TableCell>25/02/2024</TableCell>
                {file.transcriptionStatus==="On Wait" ? 
                  <TableCell> 
                    <Button
                      variant={"link"}
                      className='pl-0'
                      onClick={() => handleTranscription(file)}
                      disabled={startedTranscription}
                    >
                      <Play className='w-4 h-4 mr-2'/>
                      Start
                    </Button> 
                  </TableCell>
                    :
                  <TableCell>{file.transcriptionStatus}</TableCell>
                  }
                <TableCell>
                  <Button variant={"link"}  
                    onClick={() => handleDownload(file)} 
                    disabled={
                      !finishedTranscription || 
                      file.transcriptionStatus !== "Finished"
                    } 
                    className='pl-0'>
                    {!transcription ? <p>Unavailable</p> : 
                      <>
                        <Download className='w-4 h-4 mr-2'/>
                        Download
                      </>
                    }
                    
                  </Button>
                </TableCell>
                <TableCell><Button className='bg-rose-700' onClick={()=> handleDelete(file)}><Trash className='w-4 h-4 mr-2'/>Delete</Button></TableCell>
              </>
            :
              <TableCell className='p-3'>No file uploaded</TableCell>
            }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  );
}