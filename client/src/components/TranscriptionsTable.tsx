import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { fetchTranscriptionFile, getTranscriptionsEntries, processDelete, processTranscription } from '../utils/api-client';
import { FileEntry } from '../shared/Types';
import { formatFileSize, generateTXT} from '../utils/utils';
import { Table,TableBody, TableCell, TableHead, TableHeader, TableRow } from './UI/Table';
import { Button } from './UI/Button';
import { Play, Trash, Download } from 'lucide-react';
import { User } from '../shared/User';

type TableProps = {
  user:User|undefined;
  files:FileEntry[];
  setFiles: Dispatch<SetStateAction<FileEntry[] | undefined>>;
}

export const TranscriptionsTable:React.FC<TableProps> = ({user,files,setFiles}):JSX.Element => {
  const [transcriptionStatus, setTranscriptionStatus] = useState<{ [key: string]: boolean }>({});

  const handleTranscription = async (file:FileEntry) => {
    if(user){
      setTranscriptionStatus((prev) => ({ ...prev, [file.file_id]: true }));

      await processTranscription(file.file_id, file.filename,file.user_id,
        (message) => console.log(message), 
        (error) => console.error(error))
      
      setTranscriptionStatus((prev) => ({ ...prev, [file.file_id]: false }));
      
      fetchTranscriptions()
    }
  }

  const handleDownload = async (file:FileEntry) => {
    if(!file.transcribed){
      return
    }

    const transcription = await fetchTranscriptionFile(
      file.file_id,
      (message) => console.log(message), 
      (error) => console.error(error)
    )

    generateTXT(transcription)
  };

  const handleDelete = async (file:FileEntry) => {
    if(files.length === 0 || files === undefined || file === undefined){
      return;
    }

    await processDelete(file.file_id, file.user_id, 
      (message) => {console.log(message)}, 
      (error) => console.error(error))
    
    fetchTranscriptions()
  } 
  
  const fetchTranscriptions = async () => {
    if(user){
      const response = await getTranscriptionsEntries(
        user.id,
        (message) => console.log(message), 
        (error) => console.error(error)
      );

      setFiles(response)
      return;
    };
    setFiles([]);
  }

  useEffect(() => {
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
                <TableHead>Action</TableHead>
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
                                    "Done"
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
                          <TableCell className='p-3'>No file uploaded</TableCell>
                      </TableRow>
                )}
            </TableBody>
        </Table>
    </div>
);
}