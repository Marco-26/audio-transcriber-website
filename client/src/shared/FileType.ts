export type FileInfo = {
  file:File,
  name: string,
  size: number,
  transcriptionStatus: "On Wait" | "Processing" | "Ready",
  transcriptionFileName:string
}
