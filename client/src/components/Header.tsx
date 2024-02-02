import '../index.css'

export const Header = ():JSX.Element => {
  return (
    <nav className="border-b border-gray-700 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 px-7">
        <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-slate-300">Transcribify</span>
        </a>
      </div>
    </nav>
  )
}