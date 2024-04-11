import { Loader2, PlusCircle } from "lucide-react"
import { Button } from "./UI/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./UI/Dialog"
import { Input } from "./UI/Input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./UI/Form"
import { z } from "zod";  
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { processUpload } from "../utils/api-client"
import { AxiosError } from "axios"
import { Dispatch, SetStateAction } from "react"
import { FileInfo } from "../shared/FileType"
import { generateFileInfo, notifyError } from "../utils/utils"

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify"

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, `Required`),
});

interface UploadFileButtonProps{
  setFile: Dispatch<SetStateAction<File | undefined>>;
  setFileInfo: Dispatch<SetStateAction<FileInfo | undefined>>;
}

export const UploadFileButton:React.FC<UploadFileButtonProps> = ({setFile, setFileInfo}):JSX.Element => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });

  const fileRef = form.register("file");
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const file = values.file[0];
    if (file.type !== "audio/mpeg") {
      notifyError("File type not supported... Audio files only");
      return;
    }

    await processUpload(file,
      (message: string) => {
        console.log(message)
        setFile(file)
        setFileInfo(generateFileInfo(file, values.title))
      },
      (error: AxiosError) => {
        console.error("\nError: " + error)
      })
  }

  return (
    <>
      <ToastContainer/>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2"/>
            New Transcription
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-3">Upload your File Here</DialogTitle>
          </DialogHeader>

          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel>File</FormLabel>
                      <FormControl>
                        <Input type="file" {...fileRef}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex gap-1"
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      </>
  )
}

