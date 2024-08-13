'use client'
import { useState, useEffect } from 'react'

export default function FollowButton({ userId, followId, initialIsFollowing }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)

  const handleClick = async () => {
    if (isFollowing) {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}/${followId}/unfollow`, {
          method: 'POST',
        })
        const data = await response.json()
        console.log('Unfollow response:', data)
        setIsFollowing(false) // Update the state
      } catch (error) {
        console.error('Error unfollowing user:', error)
      }
    } else {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}/${followId}/follow`, {
          method: 'POST',
        })
        const data = await response.json()
        console.log('Follow response:', data)
        setIsFollowing(true) // Update the state
      } catch (error) {
        console.error('Error following user:', error)
      }
    }
  }
  return (
    <button
      onClick={() => handleClick()}
      disabled={followId === userId}
      className={` text-white px-4 py-2 rounded transition-colors duration-300 ease-in-out ${
        isFollowing ? 'bg-red-600' : 'bg-green-600'
      } ${followId === userId ? 'bg-gray-700 text-gray-600 cursor-not-allowed' : 'hover:bg-green-900'}`}
    >
      {followId === userId ? 'You' : isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  )
}
