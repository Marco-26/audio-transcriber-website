import { Dispatch, SetStateAction, useState } from "react"
import { BrowserRouter as Router,  Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./UI/Dropdown"
import {
  CircleUser,
  Package2,
  PlusCircle,
  Upload,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./UI/Sheet";
import { Button } from "./UI/Button";
import { Input } from "./UI/Input";
import { Popover, PopoverContent, PopoverTrigger } from "./UI/Popover";
import { Label } from "./UI/Label";
import { ChangeEvent, useRef } from "react";
import { UploadStatus, generateFileInfo, notifyError } from "../utils/utils";
import { FileInfo } from "../shared/FileType";
import { processUpload } from "../utils/api-client";
import { AxiosError } from "axios";

interface HeaderProps {
  file:File | undefined;
  setFile: Dispatch<SetStateAction<File | undefined>>;
  fileInfo:FileInfo | undefined;
  setFileInfo: Dispatch<SetStateAction<FileInfo | undefined>>;
  setUploadStatus: Dispatch<SetStateAction<UploadStatus | undefined>>;
}
export const Header: React.FC<HeaderProps> = ({file, setFile, fileInfo, setFileInfo, setUploadStatus}):JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileNameInputRef = useRef<HTMLInputElement>(null);
  const [tempFile, setTempFile] = useState<File>();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (event.target.files) {
      const temp:File = event.target.files[0];
      if (temp.type !== "audio/mpeg") {
        notifyError("File type not supported...");
        return;
      }
      setTempFile(temp)
    }
  }

  const handleFileUpload = async () => {
    await processUpload(tempFile!,
      (message: string) => {
        console.log(message)
        setFile(tempFile)
        setUploadStatus(UploadStatus.OK)
        const inputValue = inputRef.current?.value ?? '';
        setFileInfo(generateFileInfo(tempFile!,inputValue));
      },
      (error: AxiosError) => {
        console.error("\nError: " + error)
        setUploadStatus(UploadStatus.ERROR)
        setFileInfo((prevFileInfo) => {
          if (prevFileInfo) {
            return { ...prevFileInfo, uploadStatus: "Error" };
          }
          return prevFileInfo;
        });
      })
  }

  return (
    <nav>
      <Router>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Link
            to="#"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            to="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            to="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Settings
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                to="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                to="#"
                className="text-muted-foreground hover:text-foreground"
              >
                About
              </Link>
              <Link to="#" className="hover:text-foreground">
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <PlusCircle className='w-4 h-4 mr-2'/>
                  New Transcription
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <div className="grid grid-cols-2 items-center gap-4">
                      <Label htmlFor="width">File</Label>
                      {tempFile ? <Label htmlFor="width">1 file selected</Label> : "0 files selected"}
                    </div>
                    <input type="file" id="file" className="invisible opacity-0 w-0 h-0 absolute" ref={inputRef} onChange={handleFileChange} />
                    <Button variant="outline" onClick={() => inputRef.current?.click()}>
                        Select
                    </Button>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="maxWidth">File Name</Label>
                      <Input
                        id="maxWidth"
                        defaultValue="transcription"
                        className="col-span-2 h-8"
                        ref={fileNameInputRef}
                      />
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => handleFileUpload()}>
                    <Upload className='w-4 h-4 mr-2'/>
                    Upload
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      </Router>

        </nav>
  )
}