# Audio Transcription Website

Streamline your audio transcription tasks with this intuitive website. Convert your audio files into text effortlessly with a user-friendly graphical interface.
This project makes use of a script from another GitHub repository: [audio-transcriber](https://github.com/Marco-26/audio-transcriber), which is maintained by me. The script has been slightly modified to accommodate the functionality of this project.

## Features
- Effortless Transcription: Simplify the process of converting audio to text.
- Graphical User Interface (GUI): Intuitive controls for easy navigation.
- Fast Processing: Quickly transcribe your audio files with efficiency.
- Flexible: Supports various audio formats for transcription.

## Usage
1. Upload your audio file.
2. Start transcription with a single click.
3. Download the transcribed text once processing is complete.

## Prerequisites
- `react` (Frontend library)
- `Python` (Backend language)
- `flask` Python package (`pip install flask`)
- `flask-cors` Python package (`pip install flask-cors`)
- An OpenAI API key set as an environment variable named `OPENAI_API_KEY`

Alternatively, you can install all dependencies *in the backend* by running:

```bash
pip install -r requirements.txt
```

## Installation
1. Clone this repository:
```bash
  git clone https://github.com/your-username/audio-transcription-website.git
```
2.Navigate to the project directory:

```bash
cd audio-transcriber-website
```

3. Start the server
 ```bash
cd server
python server
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

