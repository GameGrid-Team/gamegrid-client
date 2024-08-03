'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function ProfilePage({ params }) {
  const [userData, setFormData] = useState({
    first_name: '',
    last_name: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birth_date: '',
    instagram: '',
    facebook: '',
  })

  const [initialData, setInitialData] = useState({})
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z]).{1,8}$/
    return passwordRegex.test(password)
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`http://localhost:3001/api/users/${params.id}/data`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const userData = await userResponse.json()

        if (userResponse.ok) {
          setFormData({
            first_name: userData.first_name,
            last_name: userData.last_name,
            nickname: userData.nickname,
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.password,
            gender: userData.gender,
            birth_date: userData.birth_date,
            instagram: userData.social.instagram,
            facebook: userData.social.facebook,

            //instagram: userData.social.social_networks[0].link,
          })
          setInitialData({
            first_name: userData.first_name,
            last_name: userData.last_name,
            nickname: userData.nickname,
            email: userData.email,
            gender: userData.gender,
            birth_date: userData.birth_date,
            instagram: userData.social.instagram,
            facebook: userData.social.facebook,
          })
        } else {
          console.error('Error fetching user data:', userData)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [params.id])

  const handleChange = (e) => {
    setFormData({
      ...userData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { confirmPassword, password, ...currentData } = userData

    if (password && !validatePassword(password)) {
      alert(
        'Password must be at most 8 characters long and contain at least one uppercase letter and at least one symbol.'
      )
      return
    }

    if (password && password !== confirmPassword) {
      alert('Passwords do not match.')
      return
    }

    const changedData = {}
    Object.keys(currentData).forEach((key) => {
      if (currentData[key] !== initialData[key]) {
        changedData[key] = currentData[key]
      }
    })
    console.log('curr:', currentData)
    console.log('after change', changedData)

    if (password) {
      changedData.password = password
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_HOST}/api/users/${params.id}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(changedData),
    })

    const data = await response.json()

    if (response.ok) {
      console.log('Update successful:', data)
      // Navigate to the home page after success
      window.location.href = '/HomePage'
    } else {
      console.error('Update failed:', data)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex-auto w-full">
      <Head>
        <title>Profile</title>
      </Head>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="first_name"
              value={userData.first_name}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={userData.last_name}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Nickname</label>
            <input
              type="text"
              name="nickname"
              value={userData.nickname}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={userData.gender}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Birth Date</label>
            <input
              type="date"
              name="birth_date"
              value={userData.birth_date}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Facebook</label>
            <input
              type="text"
              name="facebook"
              value={userData.facebook}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Instagram</label>
            <input
              type="text"
              name="instagram"
              value={userData.instagram}
              onChange={handleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded-md">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}
