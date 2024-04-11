import React, { useState } from 'react';
import { processTranscription } from '../utils/api-client';
import { FileInfo } from '../shared/FileType';
import { formatFileSize, generateTXT } from '../utils/utils';
import { Table,TableBody, TableCell, TableHead, TableHeader, TableRow } from './UI/Table';
import { Button } from './UI/Button';
import { Play, Trash, Download } from 'lucide-react';

type TableProps = {
  fileInfo?:FileInfo
  file:File
}

export const TranscriptionsTable:React.FC<TableProps> = ({fileInfo,file}):JSX.Element => {
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
      generateTXT(transcription, fileInfo?.transcriptionFileName!)
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
            <TableRow>
            {fileInfo ?
            <>
              <TableCell>
                {fileInfo.name}
              </TableCell>
              <TableCell>{formatFileSize(fileInfo.size)}</TableCell>
              {finishedTranscription ? (
                <TableCell>Finished</TableCell>
              ) : (
                startedTranscription ? (
                  <TableCell>
                    Processing<span className="dots">...</span>
                  </TableCell>
                ) : (
                  <TableCell>
                    <Button
                      variant={"link"}
                      className='pl-0'
                      onClick={handleTranscription}
                    >
                      <Play className='w-4 h-4 mr-2'/>
                      Start
                    </Button>
                  </TableCell>
                )
              )}
              <TableCell>
                <Button variant={"link"}  onClick={handleDownload} disabled={!finishedTranscription} className='pl-0'>
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
          </TableBody>
        </Table>
      </div>
  );
}