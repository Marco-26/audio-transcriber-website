export const Upload = ():JSX.Element => {
  return (
    <div className='px-7 mt-4'>\
      <h1 className='font-bold text text-slate-300 text-2xl'>Upload</h1>
      <button className="w-full border border-gray-700 rounded-md h-24 mt-3 bg-gray-800">
        <p>Select your files here</p>
        <p className="text-xs">Files supported: MP3</p>
      </button>
    </div>
  )
}