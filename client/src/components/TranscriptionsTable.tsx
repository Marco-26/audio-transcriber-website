import React, { useState } from 'react';
import { processTranscription } from '../utils/api-client';
import { FileInfo } from '../shared/FileType';
import { UploadStatus, formatFileSize, generateTXT } from '../utils/utils';
import { Table,TableBody, TableCell, TableHead, TableHeader, TableRow } from './UI/Table';
import { Button } from './UI/Button';
import { Play, Trash, Download } from 'lucide-react';

type TableProps = {
  fileInfo?:FileInfo
  file:File
  uploadStatus: UploadStatus
}

export const TranscriptionsTable:React.FC<TableProps> = ({fileInfo,file,uploadStatus}):JSX.Element => {
  const [startedTranscription, setStartedTranscription] = useState<Boolean>(false)
  const [finishedTranscription, setFinishedTranscription] = useState<Boolean>(false)
  const [transcription, setTranscription] = useState<string>()
  
  const handleTranscription = async () => {
    if(uploadStatus === UploadStatus.ERROR || uploadStatus == null){
      console.error("No file uploaded")
      return
    }

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
            <TableHead>Upload</TableHead>
            <TableHead>Transcription Status</TableHead>
            <TableHead className=''>Download</TableHead>
          </TableHeader>
          <TableBody>
            <TableRow>
            {fileInfo ?
            <>
              <TableCell>
                {fileInfo.name}
              </TableCell>
              <TableCell>{formatFileSize(fileInfo.size)}</TableCell>
              <TableCell>{UploadStatus[uploadStatus]}</TableCell>
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
                      disabled={uploadStatus !== UploadStatus.OK}
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