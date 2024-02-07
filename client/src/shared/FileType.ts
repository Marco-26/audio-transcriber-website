export type FileToTranscribe = {
  name: string,
  duration: string, //TODO: MAYBE CHANGE TO DATE
  size: number,
  transcriptionStatus: "Processing" | "Ready",
  uploadStatus: "Processing" | "Uploaded" | "Error"
}