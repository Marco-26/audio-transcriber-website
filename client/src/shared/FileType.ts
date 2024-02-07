export type FileInfo = {
  name: string,
  duration: string, //TODO: MAYBE CHANGE TO DATE
  size: number,
  transcriptionStatus: "Processing" | "Ready",
  uploadStatus: "Processing" | "Uploaded" | "Error"
}

export type Transcription = {
  file:File,
  info:FileInfo,
  transcription:string
}