'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Toaster, toast } from 'sonner'
import { logoutbtn } from '../actions'

export const HomeNav = ({ userId }) => {
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [username, setUsername] = useState('')
  const [searchText, setSearchText] = useState('')
  const [numNotify, setNumNotify] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [notifyList, setNotifyList] = useState(false)
  const dropdownRef = useRef(null)
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  useEffect(() => {
    const userResponse = async () => {
      try {
        if (userId) {
          const response = await fetch(`https://gamegrid-server.onrender.com/api/users/${userId}/data`)
          const userData = await response.json()

          if (response.ok) {
            setUsername(userData.nickname)
            setAvatarPreview(userData.avatar)
            const userResponse = await fetch(`http://localhost:3001/api/users/${userId}/data`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            })
            const user = await userResponse.json()
            const notList = user.notification.map((notification) => notification.message)
            setNotifyList(notList)
            setNumNotify(notList.length)
          }
        }
      } catch (error) {
        console.error('Error fetching user data', error)
      }
    }
    userResponse()
  }, [userId])

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://gamegrid-server.onrender.com/api/users/search?text=${encodeURIComponent(searchText)}`
      )
      const searchData = await response.json()

      if (response.ok) {
        setSearchResults(searchData.users)
      } else {
        console.error('Search failed', searchData.message)
      }
    } catch (error) {
      console.error('Error executing search', error)
    }
  }
  const handleLogout = () => {
    toast.success('Logged out successfully')
    logoutbtn().then(() => {
      window.location.href = '/'
    })
  }
  //For search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (e) => {
    setSearchText(e.target.value)
    if (e.target.value) {
      setIsDropdownVisible(true)
      handleSearch()
    } else {
      setIsDropdownVisible(false)
    }
  }

  const toggleDropdown = async () => {
    try {
      const userResponse = await fetch(`http://localhost:3001/api/users/${userId}/data`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const user = await userResponse.json()
      const notList = user.notification.map((notification) => notification.message)

      setNotifyList(notList)
      setNumNotify(notList.length)

      // await sleep(3000)
    } catch (error) {
      console.error(error)
    }
    setIsDropdownOpen(!isDropdownOpen)
  }

  const clearNotification = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}/notification/clear`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      setNumNotify(0)
    } catch (error) {
      console.error(error)
    }
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <>
      <div className="navbar">
        <div className="navbar-start">
          <Link href="/HomePage" className="p-2">
            <Image src="/GameGridonlylogo.png" alt="Logo" width={100} height={100} />
          </Link>
        </div>

        <div className="lg:flex md:flex lg:flex-1 justify-normal font-normal hidden">
          <div className="flex-8">
            <ul className="flex gap-8 text-[18px] -ml-32">
              <Link href="/HomePage/LeaderBoard">
                <li className="hover:bg-cyan-800 hover:rounded">LeaderBoard</li>
              </Link>
              <Link href={`/HomePage`}>
                <li data-cy="login_button_in_heade_menu" className="hover:bg-cyan-800 hover:rounded">
                  Lobby
                </li>
              </Link>
              <Link href="/HomePage/Squad" className="hover:bg-cyan-800 hover:rounded navbar-end">
                Squad
              </Link>
            </ul>
          </div>
        </div>

        <div className="form-control">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
              value={searchText}
              onChange={handleInputChange}
            />
            {isDropdownVisible && searchResults.length > 0 && (
              <div
                ref={dropdownRef}
                className="dropdown-content absolute z-10 w-full bg-gray-100 shadow-lg rounded-lg mt-1"
              >
                <ul className="py-2">
                  {searchResults.map((user, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-2 hover:bg-primary hover:text-white transition duration-200 ease-in-out text-gray-700"
                    >
                      <Link href={`/HomePage/Profile/${user._id}`} className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <Image src={user.avatar} width={48} height={48} className="object-cover" />
                        </div>
                        <div>
                          <span title={user.nickname.length > 10 ? user.nickname : ''}>
                            {user.nickname.length > 10 ? `${user.nickname.slice(0, 10)}...` : user.nickname}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <button className="btn btn-ghost btn-circle" onClick={toggleDropdown} onChange={toggleDropdown}>
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="badge badge-xs badge-primary indicator-item">{numNotify}</span>
            </div>
          </button>
          <div className="relative">
            {isDropdownOpen && (
              <div className="absolute mt-6 right-0 mt-2 w-48 bg-gray-500 rounded-lg shadow-lg z-50">
                <ul className="py-2">
                  {notifyList.map((user, index) => (
                    <li key={index} className="relative px-4 py-2 text-sm hover:bg-gray-400">
                      {user}
                    </li>
                  ))}
                  <li className="relative px-4 py-2 text-sm">
                    {numNotify === 0 ? (
                      <span className="text-white text-center">No notifications</span>
                    ) : (
                      <button
                        onClick={clearNotification}
                        className="w-full text-center text-white bg-gray-600 hover:bg-gray-800 py-2 rounded-md font-medium border-gray-900 border-4"
                      >
                        Clear
                      </button>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="User avatar" src={avatarPreview} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href={`/HomePage/Profile/${userId}`} className="justify-between">
                Profile
              </Link>
            </li>
            <li>
              <Link href={`/HomePage/Profile/${userId}/edit`}>Edit Profile</Link>
            </li>
            <li>
              <Link href={`/HomePage/Profile/${userId}/Save`}>Saved</Link>
            </li>
            <li>
              <Link href={`/HomePage/Profile/${userId}/Like`}>Liked</Link>
            </li>
            <li>
              <Link href={`/HomePage/Profile/${userId}/stats`}>Stats</Link>
            </li>
            <li>
              <Toaster />
              <button className="" onClick={() => handleLogout()}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Optionally, render the search results */}
    </>
  )
}

export default HomeNav
