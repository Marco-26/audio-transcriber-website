export type FileInfo = {
  name: string,
  size: number,
  transcriptionStatus: "On Wait" | "Processing" | "Ready",
  transcriptionFileName:string
}

export type Transcription = {
  file:File,
  info:FileInfo,
  transcription:string
}