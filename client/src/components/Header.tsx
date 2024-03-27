import '../index.css'

export const Header = ():JSX.Element => {
  return (
    <nav className="border-b border-gray-700 p-4 px-7">
      <div className="flex flex-wrap items-center justify-between mx-auto ">
      <span className="self-center text-2xl font-semibold whitespace-nowrap text-slate-300">Audio Transcriber</span>
      </div>
    </nav>
  )
}