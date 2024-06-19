export type FileEntry = {
  id:number,
  name: string,
  size: number,
  date:Date,
  transcriptionStatus: "On Wait" | "Processing..." | "Finished",
  transcriptionFileName:string
}
