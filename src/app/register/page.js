'use client'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faUserPlus, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import AlertDialog from '@/app/components/Alerts'

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birth_date: '',
  })

  function calculateAge(dateOfBirth) {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()

    // Adjust age if the current date is before the birth date in the current year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z]).{8,16}$/
    return passwordRegex.test(password)
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    const { confirmPassword, ...dataToSend } = formData

    if (!validatePassword(formData.password)) {
      document.getElementById('alert-fail-pass').showModal()
      return
    }

    if (formData.password !== formData.confirmPassword) {
      document.getElementById('alert-fail-pass-match').showModal()
      return
    }
    const age = calculateAge(formData.birth_date)
    if (age < 16) {
      document.getElementById('alert-age-limit').showModal()
      return
    }
    // שליחת בקשת POST לשרת
    const response = await fetch(`https://gamegrid-server.onrender.com/api/users/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })

    const data = await response.json()

    if (response.ok) {
      // ניתוב לדף הבית לאחר הצלחה
      window.location.href = '/' ////////////////////
    } else {
      if (data.emailCheck === 1) {
        const emailInput = document.getElementById('email')
        emailInput.placeholder = 'Email is taken'
        emailInput.value = ''
        emailInput.style.borderColor = 'red'
      }
      if (data.nickCheck === 1) {
        const nicknameInput = document.getElementById('nickname')
        nicknameInput.placeholder = 'Nickname is taken'
        nicknameInput.value = ''
        nicknameInput.style.borderColor = 'red' // You can add more actions here, like showing an alert or a toast notification
      }
    }
  }

  const handleGoogleSignIn = () => {}

  return (
    <main className="relative flex min-h-screen items-center justify-center p-6">
      <div className="relative z-10 w-full max-w-lg p-8 space-y-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg border-2 border-gray-700">
        <div className="flex justify-center mb-4">
          <FontAwesomeIcon icon={faUserPlus} size="3x" className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-center text-white">Register</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-300">
              First Name:
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              required
              value={formData.first_name}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-700 rounded-md bg-gray-800 text-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-300">
              Last Name:
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              required
              value={formData.last_name}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-700 rounded-md bg-gray-800 text-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-300">
              Nickname:
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              required
              value={formData.nickname}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-700 rounded-md bg-gray-800 text-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              E-mail:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-700 rounded-md bg-gray-800 text-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          </div>
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Confirm Password:
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-700 rounded-md bg-gray-800 text-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-300">
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-700 rounded-md bg-gray-800 text-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-300">
              Birth Date:
            </label>
            <input
              id="birth_date"
              name="birth_date"
              type="date"
              required
              value={formData.birth_date}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-700 rounded-md bg-gray-800 text-gray-300 focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
          >
            Register
          </button>
          <div className="py-2">
            <Link href={'/login'} className="">
              <button
                type="button"
                className="flex items-center justify-center w-full py-3 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-red-500"
              >
                Login
              </button>
            </Link>
          </div>
        </form>
        <AlertDialog text={'Passwords do not match!'} type={'fail-pass-match'} />
        <AlertDialog text={'Must be over 16 years old'} type={'age-limit'} />
        <AlertDialog text={'Password lenfth 8-16, incluide upercase and simbol.'} type={'fail-pass'} />
      </div>
    </main>
  )
}
