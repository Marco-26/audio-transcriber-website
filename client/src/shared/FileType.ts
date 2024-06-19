export type FileInfo = {
  id:number,
  // file:File | undefined,
  name: string,
  size: number,
  date:Date,
  transcriptionStatus: "On Wait" | "Processing..." | "Finished",
  transcriptionFileName:string
}
