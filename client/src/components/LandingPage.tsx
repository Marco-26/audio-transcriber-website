import React from 'react';

const LandingPage = () => {
  return (
    <div className="max-h-screen">
      <main className="flex flex-col items-center justify-center max-w-7xl">
        <h1 className="text-5xl font-bold text-left">
          Effortlessly Transcribe Audio <br/> with Just a Click
        </h1>
        <p className="text-xl text-center mt-4">
          Save valuable time by converting your audio recordings into text seamlessly with our AI-powered transcription tool. Perfect for meetings, interviews, podcasts, or any other spoken content.
        </p>
        <button className="bg-blue-500 text-white px-6 py-3 rounded mt-8">
          LOGIN
        </button>


        <div className="flex flex-col items-center mt-10">
          <p className="text-lg">
            Join the <span className="text-blue-400">124244 users</span> and start transcribing your audios.
          </p>
          <p className="text-2xl font-bold mt-4">Like seriously, it's THIS easy</p>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;