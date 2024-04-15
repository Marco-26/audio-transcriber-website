import React, { useState } from 'react';
import { processTranscription } from '../utils/api-client';
import { FileInfo } from '../shared/FileType';
import { formatFileSize, generateTXT } from '../utils/utils';
import { Table,TableBody, TableCell, TableHead, TableHeader, TableRow } from './UI/Table';
import { Button } from './UI/Button';
import { Play, Trash, Download } from 'lucide-react';

type TableProps = {
  files:FileInfo[]
}

export const TranscriptionsTable:React.FC<TableProps> = ({files}):JSX.Element => {
  const [startedTranscription, setStartedTranscription] = useState<boolean>(false)
  const [finishedTranscription, setFinishedTranscription] = useState<Boolean>(false)
  const [transcription, setTranscription] = useState<string>()
  
  const handleTranscription = async (file:FileInfo) => {
    setFinishedTranscription(false);
    setStartedTranscription(true);
    file.transcriptionStatus = "Processing...";
    
    await processTranscription(file.file, 
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

  return (
    <div className='border rounded'>
        <Table>
          <TableHeader>        
            <TableHead>Name</TableHead>
            <TableHead>Metadata</TableHead>
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
                    <Download className='w-4 h-4 mr-2'/>
                    Download
                  </Button>
                </TableCell>
                <TableCell><Button className='bg-rose-700	'><Trash className='w-4 h-4 mr-2'/>Delete</Button></TableCell>
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