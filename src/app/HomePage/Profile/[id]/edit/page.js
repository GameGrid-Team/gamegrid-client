'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import LoadingOverlay from '@/app/components/loading'
import AlertDialog from '@/app/components/Alerts'

export default function ProfilePage({ params }) {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const [userData, setFormData] = useState({
    first_name: '',
    last_name: '',
    nickname: '',
    email: '',
    bio: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birth_date: '',
    instagram: '',
    facebook: '',
    avatar: null, // Add avatar field
  })

  const [initialData, setInitialData] = useState({})
  const [loading, setLoading] = useState(true)
  const [avatarPreview, setAvatarPreview] = useState(null)

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
            bio: userData.bio,
            password: '',
            confirmPassword: '',
            gender: userData.gender,
            birth_date: userData.birth_date,
            instagram: userData.instagram,
            facebook: userData.facebook,
          })
          setInitialData({
            first_name: userData.first_name,
            last_name: userData.last_name,
            nickname: userData.nickname,
            email: userData.email,
            bio: userData.bio,
            gender: userData.gender,
            birth_date: userData.birth_date,
            instagram: userData.instagram,
            facebook: userData.facebook,
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

  const deleteUser = async () => {
    const inputPassword = document.getElementById('passwordInput')
    let userPassword = ''
    try {
      const response = await fetch(`http://localhost:3001/api/users/${params.id}/data`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()

      if (response.ok) {
        userPassword = data.password
      }
    } catch (error) {
      console.error('Error ', error)
    }
    console.log(userPassword)
    if (inputPassword.value === userPassword) {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${params.id}/delete`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await response.json()

        if (response.ok) {
          console.log('Delete successfully', data)
          document.getElementById('confirm_modal').close()
          document.getElementById('alert-success').showModal()
          await sleep(2000)
          window.location.href = '/'
        }
      } catch (error) {
        console.error('Error deleting user data:', error)
      }
    } else {
      inputPassword.placeholder = 'password incorrect'
      inputPassword.value = ''
      inputPassword.style.borderColor = 'red'
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData({
      ...userData,
      avatar: file,
    })
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }
  const deleteAvatar = async () => {
    const response = await fetch(`http://localhost:3001/api/users/${params.id}/avatar/remove`, {
      method: 'DELETE',
    })
    if (response.ok) {
      uploadAvatar()
    }
  }
  const uploadAvatar = async () => {
    const formData = new FormData()
    formData.append('image', userData.avatar)

    const response = await fetch(`http://localhost:3001/api/users/${params.id}/avatar/upload`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    if (response.ok) {
      return
    } else {
      deleteAvatar()
    }
  }

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
  function isValidUrl(url) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '(www\\.)?' + // www (optional)
        '(instagram\\.com|facebook\\.com)' + // domain (only Instagram and Facebook)
        '(/[a-zA-Z0-9@:%_\\+.~#?&//=]*)?$',
      'i' // path (optional)
    )

    return pattern.test(url)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { confirmPassword, password, avatar, ...currentData } = userData

    if (password && !validatePassword(password)) {
      alert(
        'Password must be at most 8 characters long and contain at least one uppercase letter and at least one symbol.'
      )
      return
    }

    if (password && password !== confirmPassword) {
      document.getElementById('alert-fail-pass-match').showModal()
      // alert('Passwords do not match.')
      return
    }
    const age = calculateAge(userData.birth_date)
    if (age < 16) {
      document.getElementById('alert-age-limit').showModal()
      // alert('Must be over 16 years old')
      return
    }

    const fbURL = document.getElementById('fbURL')
    const inURL = document.getElementById('inURL')
    // alert(!checkURLExists(fbURL.value))

    if (fbURL.value !== '') {
      if (await !isValidUrl(fbURL.value)) {
        fbURL.placeholder = 'URL not valid'
        fbURL.value = ''
        fbURL.style.borderColor = '#c72522'
        fbURL.style.borderWidth = '4px'
        return
      }
    }
    if (!inURL.value !== '') {
      if (await !isValidUrl(inURL.value)) {
        inURL.placeholder = 'URL not valid'
        inURL.value = ''
        inURL.style.borderColor = '#c72522'
        inURL.style.borderWidth = '4px'
        return
      }
    }

    const changedData = {}
    Object.keys(currentData).forEach((key) => {
      if (currentData[key] !== initialData[key]) {
        changedData[key] = currentData[key]
      }
    })

    if (password) {
      changedData.password = password
    }

    let avatarURL = null
    if (avatar) {
      avatarURL = await uploadAvatar()
      alert('uploading avatar...')
      window.location.href = '/HomePage/Profile/' + params.id
    }

    const response = await fetch(`http://localhost:3001/api/users/${params.id}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(changedData),
    })

    const data = await response.json()
    if (response.ok) {
      console.log('Update successful:', data)
      window.location.href = '/HomePage/Profile/' + params.id
    } else {
      if (data.message.includes('Nickname')) {
        const nicknameEl = document.getElementById('nickname')
        nicknameEl.placeholder = 'Nickname is taken'
        nicknameEl.value = ''
        nicknameEl.style.borderColor = '#c72522'
        nicknameEl.style.borderWidth = '4px'
        return
      }
      if (data.message.includes('Email')) {
        const emailEl = document.getElementById('email')
        emailEl.placeholder = 'Email is taken'
        emailEl.value = ''
        emailEl.style.borderColor = '#c72522'
        emailEl.style.borderWidth = '4px'
        return
      }
    }
  }

  if (loading) {
    return <LoadingOverlay />
  }

  return (
    <div className="min-h-screen flex-auto w-full">
      <Head>
        <title>Profile</title>
      </Head>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className=" flex flex-row justify-center space-x-40">
            {/* //first 6 elements */}
            <div className="w-80 ">
              <div className="group">
                <label className="mt-3 block text-sm font-medium  transition-all duration-300 ease-in-out group-focus-within:text-green-500 group-focus-within:font-bold">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={userData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 border-gray-300 rounded-none  text-green-200 placeholder-gray-400 focus:border-b-4 focus:border-green-500 focus:outline-none transition-all duration-300 ease-in-out bg-transparent"
                />
              </div>

              <div className="group">
                <label className="mt-3 block text-sm font-medium  transition-all duration-300 ease-in-out group-focus-within:text-green-500 group-focus-within:font-bold">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={userData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 border-gray-300 rounded-none  text-green-200 placeholder-gray-400 focus:border-b-4 focus:border-green-500 focus:outline-none transition-all duration-300 ease-in-out bg-transparent"
                />
              </div>
              <div className="group">
                <label className="mt-3 block text-sm font-medium  transition-all duration-300 ease-in-out group-focus-within:text-green-500 group-focus-within:font-bold">
                  Nickname
                </label>
                <input
                  id="nickname"
                  required
                  type="text"
                  name="nickname"
                  value={userData.nickname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 border-gray-300 rounded-none  text-green-200 placeholder-gray-400 focus:border-b-4 focus:border-green-500 focus:outline-none transition-all duration-300 ease-in-out bg-transparent"
                />
              </div>
              <div className="group">
                <label className="mt-3 block text-sm font-medium  transition-all duration-300 ease-in-out group-focus-within:text-green-500 group-focus-within:font-bold">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 border-gray-300 rounded-none  text-green-200 placeholder-gray-400 focus:border-b-4 focus:border-green-500 focus:outline-none transition-all duration-300 ease-in-out bg-transparent"
                />
              </div>

              <div className="group">
                <label className="mt-3 block text-sm font-medium  transition-all duration-300 ease-in-out group-focus-within:text-green-500 group-focus-within:font-bold">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 border-gray-300 rounded-none text-green-200 placeholder-gray-400 focus:border-b-4 focus:border-green-500 focus:outline-none transition-all duration-300 ease-in-out bg-transparent"
                />
              </div>

              <div className="group">
                <label className="mt-3 block text-sm font-medium  transition-all duration-300 ease-in-out group-focus-within:text-green-500 group-focus-within:font-bold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 border-gray-300 rounded-none text-green-200 placeholder-gray-400 focus:border-b-4 focus:border-green-500 focus:outline-none transition-all duration-300 ease-in-out bg-transparent"
                />
              </div>
            </div>
            {/* //second 6 elements */}
            <div className="w-80 ">
              <div className="group">
                <label className="mt-3 block text-sm font-medium  transition-all duration-300 ease-in-out group-focus-within:text-green-500 group-focus-within:font-bold">
                  Bio
                </label>
                <input
                  type="text"
                  name="bio"
                  value={userData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 border-gray-300 rounded-none text-green-200 placeholder-gray-400 focus:border-b-4 focus:border-green-500 focus:outline-none transition-all duration-300 ease-in-out bg-transparent"
                />
              </div>
              <div className="group">
                <label className="mt-3 block text-sm font-medium  transition-all duration-300 ease-in-out group-focus-within:text-green-500 group-focus-within:font-bold">
                  Gender
                </label>
                <select
                  name="gender"
                  value={userData.gender}
                  onChange={handleChange}
                  className="custom-select w-full px-4 py-2 border-b-2 border-gray-300 rounded-none text-gray-300 placeholder-gray-800 focus:border-b-4 focus:border-green-500 focus:outline-none transition-all duration-300 ease-in-out bg-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="group">
                <label className="mt-3 block text-sm font-medium  transition-all duration-300 ease-in-out group-focus-within:text-green-500 group-focus-within:font-bold">
                  Birth Date
                </label>
                <input
                  type="date"
                  name="birth_date"
                  value={userData.birth_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 border-gray-300 rounded-none text-green-200 placeholder-gray-400 focus:border-b-4 focus:border-green-500 focus:outline-none transition-all duration-300 ease-in-out bg-transparent"
                />
              </div>
              <div className="group">
                <label className="mt-3 block text-sm font-medium  transition-all duration-300 ease-in-out group-focus-within:text-green-500 group-focus-within:font-bold">
                  Facebook
                </label>
                <input
                  id="fbURL"
                  type="text"
                  name="facebook"
                  value={userData.facebook}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 border-gray-300 rounded-none text-green-200 placeholder-gray-400 focus:border-b-4 focus:border-green-500 focus:outline-none transition-all duration-300 ease-in-out bg-transparent"
                />
              </div>
              <div className="group">
                <label className="mt-3 block text-sm font-medium  transition-all duration-300 ease-in-out group-focus-within:text-green-500 group-focus-within:font-bold">
                  Instagram
                </label>
                <input
                  id="inURL"
                  type="text"
                  name="instagram"
                  value={userData.instagram}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-b-2 border-gray-300 rounded-none text-green-200 placeholder-gray-400 focus:border-b-4 focus:border-green-500 focus:outline-none transition-all duration-300 ease-in-out bg-transparent"
                />
              </div>
              <div className="group">
                <label className="mt-3 block text-sm font-medium  transition-all duration-300 ease-in-out group-focus-within:text-green-500 group-focus-within:font-bold">
                  Avatar
                </label>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border-none  rounded-none text-green-200 placeholder-gray-400 focus:border-b-4 focus:border-green-500 focus:outline-none transition-all duration-300 ease-in-out bg-transparent"
                />
                {avatarPreview && (
                  <div className="mt-2">
                    <img src={avatarPreview} alt="Avatar Preview" className="h-32 w-32 rounded-full" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="pt-7 pb-11 ml-4 flex space-x-96">
            <div className="">
              <button
                onClick={() => document.getElementById('confirm_modal').showModal()}
                type="button"
                className="px-4 py-2 ml-20  bg-red-500 text-white rounded-md hover:bg-red-600  ml-5"
              >
                Delete Profile
              </button>
            </div>
            <div className="flex justify-end ">
              <button
                type="submit"
                className="px-4 py-2  bg-green-600 text-white rounded-md hover:bg-green-800"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 ml-5"
                onClick={() => (window.location.href = '/HomePage/Profile/' + params.id)} // Or replace with your desired cancel action
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
        <dialog id="confirm_modal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">Are you sure you want to delete your account?</p>
            <div>
              <input
                type="password"
                id="passwordInput"
                placeholder="Enter your password"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 ml-5">
                  Cancel
                </button>
              </form>
              <button
                onClick={deleteUser}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 ml-5"
              >
                Delete
              </button>
            </div>
          </div>
        </dialog>
        <AlertDialog text={'Deleted User successfully!'} type={'success'} />
        <AlertDialog text={'Passwords do not match!'} type={'fail-pass-match'} />
        <AlertDialog text={'Must be over 16 years old'} type={'age-limit'} />
      </div>
    </div>
  )
}
