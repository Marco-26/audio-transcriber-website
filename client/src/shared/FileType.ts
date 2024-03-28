export type FileInfo = {
  name: string,
  size: number,
  transcriptionStatus: "Processing" | "Ready"
}

export type Transcription = {
  file:File,
  info:FileInfo,
  transcription:string
}