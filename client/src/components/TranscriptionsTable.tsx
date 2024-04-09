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
      generateTXT(transcription)
    } else {
      console.error('No transcription available');
    }
  };

  return (
    <div className='border rounded'>
        <Table>
          <TableHeader>        
            <TableHead>Nome</TableHead>
            <TableHead>Metadata</TableHead>
            <TableHead>Upload</TableHead>
            <TableHead>Transcrição</TableHead>
            <TableHead className=''>Download</TableHead>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>video2.mp3</TableCell>
              <TableCell>19.62 MB - 3:02</TableCell>
              <TableCell>OK</TableCell>
              <TableCell><Button variant={"link"} className='pl-0'><Play className='w-4 h-4 mr-2'/>Começar</Button></TableCell>
              <TableCell><Button variant={"link"} className='pl-0'><Download className='w-4 h-4 mr-2'/>Download</Button></TableCell>
              <TableCell><Button className='bg-rose-700	'><Trash className='w-4 h-4 mr-2'/>Delete</Button></TableCell>
            </TableRow>
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
                      onClick={handleTranscription}
                      disabled={uploadStatus !== UploadStatus.OK}
                      style={uploadStatus !== UploadStatus.OK ? {backgroundColor:"#939393"} : {backgroundColor:"white"}}
                    >
                      Start
                    </Button>
                  </TableCell>
                )
              )}
              <TableCell className="px-6 py-4">
                <Button style={!finishedTranscription ? {backgroundColor:"#939393"} : {backgroundColor:"white"}} onClick={handleDownload} disabled={!finishedTranscription}>Download</Button>
              </TableCell>
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