import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import TranscriptionsApi from '../api/transcriptions';
import { FileEntry } from '../types/FileEntry';
import { generateTXT} from '../utils/utils';
import { Table,TableBody, TableCell, TableHead, TableHeader, TableRow } from './UI/Table';
import { Button } from './UI/Button';
import { Play, Trash, Download,CircleCheck } from 'lucide-react';
import { User } from '../types/User';

interface TableProps {
  user:User|undefined;
  files:FileEntry[];
  setFiles: Dispatch<SetStateAction<FileEntry[] | undefined>>;
  filter:string;
}

export const TranscriptionsTable:React.FC<TableProps> = ({user,files,setFiles,filter}):JSX.Element => {
  const [transcriptionStatus, setTranscriptionStatus] = useState<{ [key: string]: boolean }>({});

  const handleTranscription = async (file:FileEntry) => {
    if(user){
      setTranscriptionStatus((prev) => ({ ...prev, [file.file_id]: true }));
      await TranscriptionsApi.processTranscription(user.id, file.file_id)
      setTranscriptionStatus((prev) => ({ ...prev, [file.file_id]: false }));
      fetchTranscriptions()
    }
  }

  const handleDownload = async (file:FileEntry) => {
    if(!file.transcribed){
      return
    }

    const transcription = await TranscriptionsApi.fetchTranscriptedFile(
      user!.id,
      file.file_id,
      (message) => console.log(message), 
      (error) => console.error(error)
    )

    if(transcription != null){
      generateTXT(transcription)
    }
  };

  const handleDelete = async (file:FileEntry) => {
    if(files.length === 0 || files === undefined || file === undefined){
      return;
    }

    await TranscriptionsApi.processDelete(file.file_id);
    
    fetchTranscriptions();
  } 
  
  const fetchTranscriptions = async () => {
    if(user){
      const files = await TranscriptionsApi.fetchTranscriptionsEntries(user.id, filter)
      setFiles(files)
      return;
    }
    setFiles(undefined)
  }

  useEffect(() => {
    fetchTranscriptions();
  }, [user, filter]);

  return (
    <div className='border rounded'>
        <Table>
            <TableHeader>        
                <TableHead>Title</TableHead>
                <TableHead>Metadata</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Transcription Status</TableHead>
                <TableHead>Download</TableHead>
            </TableHeader>
            <TableBody>
                {files && files.length > 0 ? (
                    files.map((file) => (
                        <TableRow key={file.file_id}>
                            <TableCell>{file.filename}</TableCell>
                            <TableCell>{file.info}</TableCell>
                            <TableCell>{new Date(file.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                                {file.transcribed ? (
                                  <>
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <CircleCheck style={{width:'15px', height:'15px'}}/>
                                    <p style={{ margin: 0, paddingLeft: '5px' }}>Complete</p>
                                  </div>
                                </>
                                
                                ) : (
                                    transcriptionStatus[file.file_id] ? (
                                        "Processing..."
                                    ) : (
                                        <Button
                                            variant="link"
                                            className="pl-0"
                                            onClick={() => handleTranscription(file)}
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            Start
                                        </Button>
                                    )
                                )}
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="link"
                                    onClick={() => handleDownload(file)}
                                    disabled={!file.transcribed}
                                    className='pl-0'
                                >
                                    <Download className='w-4 h-4 mr-2' />
                                    Download
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button className='bg-rose-700' onClick={() => handleDelete(file)}>
                                    <Trash className='w-4 h-4 mr-2' />
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                      ))
                  ) : (
                      <TableRow>
                          <TableCell className='p-3'>No files available</TableCell>
                      </TableRow>
                )}
            </TableBody>
        </Table>
    </div>
);
}