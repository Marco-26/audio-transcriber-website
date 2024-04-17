import React from 'react';
import { Loader2, PlusCircle} from 'lucide-react';
import { Button } from './UI/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './UI/Dialog';
import { Input } from './UI/Input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './UI/Form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { processUpload } from '../utils/api-client';
import { AxiosError } from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { FileInfo } from '../shared/FileType';
import { generateFileInfo, notifyError } from '../utils/utils';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const formSchema = z.object({
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`),
});

interface UploadFileButtonProps {
  files:FileInfo[] | undefined; 
  setFile: Dispatch<SetStateAction<FileInfo[] | undefined>>;
}

export const UploadFileButton: React.FC<UploadFileButtonProps> = ({ files, setFile }): JSX.Element => {
  const addNewFileEntry = (file: FileInfo,) => {
    setFile((prevFiles) => {
      if (!prevFiles) {
        return [file];
      } else {
        const updatedFiles = [...prevFiles, file];
        return updatedFiles;
      }
    });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const fileRef = form.register("file");
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const fileTemp = values.file[0];
    console.log("Submitting");
    try {
      await processUpload(
        fileTemp,
        (message: string) => {
          console.log(message);
        },
        (error: AxiosError) => {
          console.error('Error uploading file:', error);
          throw error;
        }
      );
  
      const file = generateFileInfo(fileTemp, "test");
      addNewFileEntry(file);
      console.log("File entry added successfully");
    } catch (error) {
      console.error('Error during file upload or processing:', error);
      notifyError("Error uploading the file...")
      return;
    }
  };

  return (
    <>
      <ToastContainer />
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2" />
            New Transcription
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-3">Upload your File(s)</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input type="file" {...fileRef} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting} className="flex gap-1">
                  {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Submit
               </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
