export type FileInfo = {
  id:number,
  // file:File | undefined,
  name: string,
  size: number,
  date:Date|undefined,
  transcriptionStatus: "On Wait" | "Processing..." | "Finished",
  transcriptionFileName:string
}
