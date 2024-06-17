export type FileInfo = {
  file:File | undefined,
  name: string,
  size: number,
  transcriptionStatus: "On Wait" | "Processing..." | "Finished",
  transcriptionFileName:string
}
