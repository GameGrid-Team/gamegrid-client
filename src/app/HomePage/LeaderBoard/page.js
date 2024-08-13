'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSessionData } from '../../actions'

export default function LeaderBoard() {
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState(null) // Add state for userId

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/users/leaderboard`) // Adjust the endpoint to your setup
      const data = await response.json()

      setUsers(data.users)
    }
    fetchData()
  }, [])
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getSessionData()
        setUserId(id)
      } catch (error) {
        console.error('Error fetching user ID:', error)
      }
    }

    fetchUserId()
  }, [])
  const handleClick = async (followid) => {
    try {
      // Replace with your actual endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/users/${userId}/${followid}/follow`,
        {
          method: 'POST',
        }
      )
      const data = await response.json()
      console.log('Follow response:', data)
    } catch (error) {
      console.error('Error following user:', error)
    }
  }

  if (!users) return <LoadingOverlay />

  return (
    <div className="h-screen flex flex-col items-center justify-center w-full">
      <main className="flex flex-col items-center justify-center w-full max-w-4xl p-4">
        <div className="overflow-x-auto w-full">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 bg-opacity-30 text-gray-800 text-lg font-bold">
                <th className="px-6 py-4 border-none"></th> {/* Numbering column */}
                <th className="px-6 py-4 border-none">Nickname</th>
                <th className="px-6 py-4 border-none">Avatar</th>
                <th className="px-6 py-4 border-none">Rank Name</th>
                <th className="px-6 py-4 border-none">Rank Image</th>
                <th className="px-6 py-4 border-none">Actions</th> {/* Follow button column */}
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 20).map((user, index) => (
                <tr
                  key={user._id}
                  className="bg-white bg-opacity-10 mb-4 rounded-lg overflow-hidden shadow-md"
                >
                  <td className="px-6 py-4 border-none text-lg font-semibold text-center">
                    # {index + 1} {/* Numbering */}
                  </td>
                  <td className="px-6 py-4 border-none text-lg">
                    <div className="flex items-center justify-center">
                      <Link href={`/HomePage/Profile/${user._id}`} className="hover:underline">
                        {user.nickname}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-none">
                    <div className="flex items-center justify-center">
                      <img
                        className="w-16 h-16 rounded-full"
                        src={user.avatar}
                        alt={`${user.nickname}'s avatar`}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 border-none">
                    <div className="flex items-center justify-center">{user.social.rank.rank_name}</div>
                  </td>

                  <td className="px-6 py-4 border-none flex items-center justify-center">
                    <img
                      className="w-16 h-16"
                      src={user.social.rank.rank_image_url}
                      alt={`${user.social.rank.rank_name} badge`}
                    />
                  </td>
                  <td id="hey" className="px-6 py-4 border-none text-center">
                    <button
                      followed={false}
                      onClick={() => handleClick(user._id)}
                      disabled={user._id === userId}
                      className={`bg-green-600 text-white px-4 py-2 rounded transition-colors duration-300 ease-in-out ${
                        user._id === userId
                          ? 'bg-gray-700 text-gray-600 cursor-not-allowed'
                          : 'hover:bg-green-900'
                      }`}
                    >
                      {user._id === userId ? 'You' : 'Follow'}
                    </button>
                  </td>
                  {/* <td className="px-6 py-4 border-none text-center">
                    <button
                      onClick={() => handleClick(user._id)}
                      disabled={user._id === userId}
                      className={`text-white px-4 py-2 rounded transition-colors duration-300 ease-in-out ${
                        userId.social.following.has(user._id)
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-green-600 hover:bg-green-700'
                      } ${user._id === userId ? 'bg-gray-700 text-gray-600 cursor-not-allowed' : ''}`}
                    >
                      {user._id === userId
                        ? 'You'
                        : followedUsers.has(user._id)
                        ? 'Unfollow'
                        : 'Follow'}
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
