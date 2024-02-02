export type FileToTranscribe = {
  name:string,
  duration:string, //TODO: MAYBE CHANGE TO DATE
  size:number,
  status: "Processing" | "Ready"
}