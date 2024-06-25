import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getTranscriptionsEntries, processDelete, processTranscription } from '../utils/api-client';
import { FileEntry } from '../shared/Types';
import { formatFileSize, generateFileInfo, generateTXT, updateFiles } from '../utils/utils';
import { Table,TableBody, TableCell, TableHead, TableHeader, TableRow } from './UI/Table';
import { Button } from './UI/Button';
import { Play, Trash, Download } from 'lucide-react';
import {removeFile} from '../utils/utils'
import { User } from '../shared/User';
import { parse } from 'path';

type TableProps = {
  user:User|undefined;
  files:FileEntry[];
  setFiles: Dispatch<SetStateAction<FileEntry[] | undefined>>;
}

export const TranscriptionsTable:React.FC<TableProps> = ({user,files,setFiles}):JSX.Element => {
  const [startedTranscription, setStartedTranscription] = useState<boolean>(false)
  const [finishedTranscription, setFinishedTranscription] = useState<boolean>(false)

  const handleTranscription = async (file:FileEntry) => {
    setFinishedTranscription(false);
    setStartedTranscription(true);
    
    await processTranscription(file.file_id, file.filename,
      (message) => console.log(message), 
      (error) => console.error(error))
    
    setStartedTranscription(false)
    setFinishedTranscription(true)
  }

  const handleDownload = (file:FileEntry) => {
    // if (transcription) {
    //   generateTXT(transcription)
    // } else {
    //   console.error('No transcription available');
    // }
  };

  const handleDelete = async (file:FileEntry) => {
    if(files.length === 0 || files === undefined || file === undefined){
      return;
    }

    const updatedFiles = await processDelete(file.file_id, file.user_id, 
      (message) => {console.log(message)}, 
      (error) => console.error(error))

    setFiles(updatedFiles)
  } 

  useEffect(() => {
    const fetchTranscriptions = async () => {
      if(user){
        const response = await getTranscriptionsEntries(
          user["id"],
          (message) => console.log(message), 
          (error) => console.error(error)
        );

        setFiles(response)
      };
    }
      
    fetchTranscriptions();
  }, [user,setFiles]);

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
            {files.map((file) => (
              <TableRow key={file.file_id}>
              {files ?
              <>
                <TableCell>
                  {file.filename}
                </TableCell>
                <TableCell>{formatFileSize(file.filesize)}</TableCell>
                <TableCell>{new Date(file.date).toLocaleDateString()}</TableCell>
                {file.transcribed === false ? 
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
                  <TableCell>Processing</TableCell>
                  }
                <TableCell>
                  <Button variant={"link"}  
                    onClick={() => handleDownload(file)} 
                    disabled={
                      !finishedTranscription || 
                      file.transcribed !== false
                    } 
                    className='pl-0'>
                    {!file.transcribed ? <p>Unavailable</p> : 
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