import boto3
from ..app import data_folder_path

BUCKET_NAME = "audio-transcriber-files"

def upload(file_name, object_name):
  s3_client = boto3.client('s3')
  response = s3_client.upload_file(file_name, BUCKET_NAME, object_name)
  return response

def download(file_name):
  s3 = boto3.resource('s3')
  output = f"{data_folder_path}/{file_name}"
  s3.Bucket(BUCKET_NAME).download_file(file_name, output)
  return output

def delete_file(file_name):
  s3_client = boto3.client('s3')
  s3_client.delete_object(Bucket=BUCKET_NAME, Key=file_name)
  print(f"Deleted: s3://{BUCKET_NAME}/{file_name}")
