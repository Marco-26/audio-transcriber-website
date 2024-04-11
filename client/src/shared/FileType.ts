export type FileInfo = {
  name: string,
  size: number,
  transcriptionStatus: "On Wait" | "Processing" | "Ready",
  transcriptionFileName:string
}
