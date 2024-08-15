'use client'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { loginbtn } from '../actions'
import LoadingOverlay from '../components/loading'
import Link from 'next/link'
export default function Login() {
  const [nickMail, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  let input
  if (nickMail.includes('@')) input = `?email=${nickMail}&password=${password}`
  else input = `?nickname=${nickMail}&password=${password}`

  const handleLogin = async (e) => {
    e.preventDefault()

    //delay for loading components
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    // שליחת בקשת POST לשרת
    const response = await fetch(`http://localhost:3001/api/login/${input}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!data) return <LoadingOverlay />
    if (response.ok) {
      // Redirect to home page on success
      alert(JSON.stringify(data))
      loginbtn(data.userid)
      window.location.href = `/HomePage`
    } else {
      alert(JSON.stringify(data))

      console.log('Login failed:\n', data.error)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center p-6">
      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg border-2 border-gray-700">
        <div className="flex justify-center mb-4">
          <FontAwesomeIcon icon={faUser} size="3x" className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-center text-white">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              E-mail\Nickname:
            </label>
            <input
              id="email"
              name="email"
              required
              value={nickMail}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-700 rounded-md bg-gray-800 text-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password:
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-700 rounded-md bg-gray-800 text-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-blue-500"
          >
            Login
          </button>
          <div className="py-2">
            <Link href={'/register'} >
              <button
                type="button"
                className="flex items-center justify-center w-full py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-red-500"
              >
                register
              </button>
            </Link>
          </div>
          <button
            type="button"
            className="w-full py-3 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-500"
          >
            Forget My Password?
          </button>
        </form>
      </div>
    </main>
  )
}
