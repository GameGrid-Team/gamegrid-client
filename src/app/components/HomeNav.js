'use client'
import { useState, useEffect, useRef } from 'react'
import Menu from '../components/Menu'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export const HomeNav = ({ userId }) => {
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [username, setUsername] = useState('')
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const userResponse = async () => {
      try {
        if (userId) {
          const response = await fetch(`http://localhost:3001/api/users/${userId}/data`)
          const userData = await response.json()

          if (response.ok) {
            setUsername(userData.nickname)
            setAvatarPreview(userData.avatar)
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
        `http://localhost:3001/api/users/search?text=${encodeURIComponent(searchText)}`
      )
      const searchData = await response.json()

      if (response.ok) {
        setSearchResults(searchData.users) // Store the results in state
      } else {
        console.error('Search failed', searchData.message)
      }
    } catch (error) {
      console.error('Error executing search', error)
    }
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
    } else {
      setIsDropdownVisible(false)
    }
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
            <button onClick={handleSearch} className="absolute right-2 top-2">
              <FontAwesomeIcon icon={faSearch} className="text-gray-500" />
            </button>

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
                          <span className="font-semibold">{user.nickname}</span>
                          <span className="text-sm text-gray-500">
                            ({user.first_name} {user.last_name})
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

        <button className="btn btn-ghost btn-circle">
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
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>

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
              <Link href="/">Logout</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Optionally, render the search results */}
    </>
  )
}

export default HomeNav
