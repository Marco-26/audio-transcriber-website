export type FileEntry = {
  id:number,
  name: string,
  size: number,
  date:Date|undefined,
  transcriptionStatus: "On Wait" | "Processing..." | "Finished",
  transcriptionFileName:string
}
