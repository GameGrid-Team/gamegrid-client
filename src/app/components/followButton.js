'use client'
import { useState } from 'react'

export default function FollowButton({ userId, followId, initialIsFollowing }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)

  const handleClick = async (followId) => {
    if (isFollowing) {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}/${followId}/unfollow`, {
          method: 'POST',
        })
        const data = await response.json()
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
        setIsFollowing(true) // Update the state
      } catch (error) {
        console.error('Error following user:', error)
      }
    }
  }

  return (
    <>
      <button
        onClick={() =>
          isFollowing ? document.getElementById(`my_modal_${followId}`).showModal() : handleClick(followId)
        }
        disabled={followId === userId}
        className={`btn text-white px-4 py-2 rounded transition-colors duration-300 ease-in-out ${
          isFollowing ? 'bg-red-600' : 'bg-green-600'
        } ${followId === userId ? 'bg-gray-700 text-gray-600 cursor-not-allowed' : 'hover:bg-green-900'}`}
      >
        {followId === userId ? 'You' : isFollowing ? 'Unfollow' : 'Follow'}
      </button>
      <dialog id={`my_modal_${followId}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg m-3">
            Are you sure you want to {isFollowing ? 'unfollow' : 'follow'}?
          </h3>

          <div className="modal-action justify-center">
            <form method="dialog">
              <button className="btn p-4 bg-green-600 text-black" onClick={() => handleClick(followId)}>
                Confirm
              </button>
              <button className="btn m-3 bg-red-700 text-black">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  )
}
