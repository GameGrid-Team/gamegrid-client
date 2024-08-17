'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSessionData } from '../../actions'
import FollowButton from '@/app/components/followButton'
import LoadingOverlay from '@/app/components/loading'

export default function LeaderBoard() {
  const [users, setUsers] = useState([])
  const [userId, setUserId] = useState(null) // Add state for userId

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://gamegrid-server.onrender.com/api/users/leaderboard`) // Adjust the endpoint to your setup
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

  if (!users) return <LoadingOverlay />

  return (
    <div className="h-screen flex flex-col items-center justify-center w-full">
      <main className="flex flex-col items-center justify-center w-full max-w-4xl p-4">
        <div className="overflow-x-auto w-full">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 bg-opacity-30 text-gray-800 text-lg font-bold">
                <th className="px-6 py-4 border-none flex items-center justify-center">
                  <div className="flex items-center">
                    <Link href={`/HomePage/rankInfo`} className="hover:underline">
                      <button className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-blue-600">
                        <span className="text-sm">i</span>
                      </button>
                    </Link>
                  </div>
                </th>
                <th className="px-6 py-4 border-none">Nickname</th>
                <th className="px-6 py-4 border-none">Avatar</th>
                <th className="px-6 py-4 border-none">Rank</th>
                <th className="px-6 py-4 border-none">Rank Emblem</th>
                <th className="px-6 py-4 border-none">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 20).map((user, index) => (
                <tr
                  key={user._id}
                  className="bg-white bg-opacity-10 mb-4 rounded-lg overflow-hidden shadow-md"
                >
                  <td className="px-6 py-4 border-none text-lg font-semibold text-center"># {index + 1}</td>
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
                  <td className="px-6 py-4 border-none text-center">
                    <FollowButton
                      userId={userId}
                      followId={user._id}
                      initialIsFollowing={user.social.followers.includes(userId)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
