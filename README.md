# Audio Transcription Website

Streamline your audio transcription tasks with our intuitive website. Convert your audio files into text effortlessly using a user-friendly graphical interface. This project utilizes a modified script from my other GitHub repository: [audio-transcriber](https://github.com/Marco-26/audio-transcriber), tailored to fit this project’s functionality.

## Features
- **OAuth2 Login System**: Secure authentication via Google.
- **Effortless Transcription**: Easily convert audio files into text.
- **Graphical User Interface (GUI)**: Navigate with intuitive, user-friendly controls.
- **Fast Processing**: Efficiently transcribe audio files.
- **Flexible**: Supports multiple audio formats.

## Usage
1. Log in using your Google account.
2. Upload your audio file.
3. Start the transcription process with a single click.
4. Download the transcribed text once processing is complete.

## Prerequisites
- Environment variables required:
  - `OPENAI_API_KEY` (OpenAI API key)
  - `GOOGLE_CLIENT_ID` (Google Client ID)
  - `GOOGLE_CLIENT_SECRET` (Google Client Secret)
  - `FLASK_SECRET_KEY` (Flask Secret Key)

## Installation
1. Clone this repository:
```bash
  git clone https://github.com/Marco-26/audio-transcription-website.git
```
2.Navigate to the project directory:

```bash
cd audio-transcriber-website
```

3. Start the server
 ```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m src.run
```

4. Start the frontend
```bash
cd client
npm start
```

Contributing
Contributions are welcome! Please read the contributing guidelines for details on how to contribute to this project.

License
This project is licensed under the MIT License - see the LICENSE file for details.

