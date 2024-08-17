import Link from 'next/link'
import Image from 'next/image'
import Header from './components/Header'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className=" bgrid grid-flow-col grid-rows-2 grid-cols-3 ">
        <div>
          <div className="relative -mt-14 -top-[150px] py-0">
            <Image src="/logo.jpg" width={550} height={400} alt="logo of game grid" />
          </div>
        </div>
      </div>
      <div>
        <h1 className="font-display p-1 relative top-[-165px] -py-1 -mt-20 items-center justify-center text-4xl font-extrabold text-transparent bg-clip-text bg-emerald-100 from-white via-gray-400 to-zinc-100 ">
          Welcome to the GameGrid!
          <br />
          a platform for gamers
          <br />
          by gamers
        </h1>
      </div>
      <nav className="flex-auto space-x-20 py-2 px-0">
        <Link
          href="/login"
          className=" px-10 py-5 font-semibold text-2xl rounded-md text-white bg-green-600 shadow-lg hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 ease-in-out"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className=" px-10 py-5 font-semibold text-2xl rounded-md text-white bg-green-600 shadow-lg hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300 ease-in-out"
        >
          Register
        </Link>
      </nav>
    </main>
  )
}
/* Landing Page */
