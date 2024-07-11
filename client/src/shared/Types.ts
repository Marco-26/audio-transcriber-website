//THIS WILL BE CREATED WHEN THE BACKEND RETRIEVES THE OBJECT
export type FileEntry = {
  file_id:number,
  user_id:string,
  filename: string,
  info:string,
  date:Date,
  transcribed:boolean
};