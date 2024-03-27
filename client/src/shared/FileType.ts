export type FileInfo = {
  name: string,
  duration: string, //TODO: MAYBE CHANGE TO DATE
  size: number,
  transcriptionStatus: "Processing" | "Ready"
}

export type Transcription = {
  file:File,
  info:FileInfo,
  transcription:string
}