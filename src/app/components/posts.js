'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { getSessionData } from '../actions'
import Link from 'next/link'
import LoadingOverlay from '../components/loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faBookmark, faShare, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

export default function Posts({ keyPost }) {
  const [sharePost, setSharePost] = useState({
    shared_post: {
      original_owner: '',
      original_post: '',
    },
  })
  const [posts, setPosts] = useState([])
  const [updatedPosts, setUpdatedPosts] = useState(posts)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState(null) // Add state for userId

  const fetchPosts = async () => {
    try {
      if (keyPost === 'following') {
        const response = await fetch(`http://localhost:3001/api/posts/${userId}/${keyPost}/posts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        if (response.ok) {
          setPosts(data.posts_list)
        } else {
          console.log('Failed to fetch posts:', data.error)
        }
      }

      if (keyPost === 'all') {
        const response = await fetch(`http://localhost:3001/api/posts/${keyPost}posts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()
        if (response.ok) {
          let post_data = data.posts_list
          setPosts(post_data)
        } else {
          console.log('Failed to fetch posts:', data.error)
        }
      }

      if (keyPost === 'MyPost') {
        const response = await fetch(`http://localhost:3001/api/posts/${userId}/posts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        if (response.ok) {
          let post_data = data.posts_list

          // console.log(post_data)
          setPosts(post_data)
        } else {
          console.log('Failed to fetch posts:', data.error)
        }
      }

      if (keyPost === 'MySaved') {
        // console.log(data)

        const response = await fetch(`http://localhost:3001/api/posts/${userId}/saved`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        if (response.ok) {
          let post_data = data.saved_post_list
          setPosts(post_data)
        } else {
          console.log('Failed to fetch posts:', data.error)
        }
      }

      if (keyPost === 'MyLiked') {
        const response = await fetch(`http://localhost:3001/api/posts/${userId}/liked`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        if (response.ok) {
          let post_data = data.liked_post_list
          console.log(post_data)

          setPosts(post_data)
        } else {
          console.log('Failed to fetch posts:', data.error)
        }
      } else if (keyPost !== 'all' && keyPost !== 'MySaved') {
        const response = await fetch(`http://localhost:3001/api/posts/${keyPost}/posts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        if (response.ok) {
          let post_data = data.posts_list
          // console.log(post_data)
          setPosts(post_data)
        } else {
          console.log('Failed to fetch posts:', data.error)
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  // Fetch userId when the component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getSessionData()
        setUserId(id) // Set userId once it is resolved
      } catch (error) {
        console.error('Error fetching user ID:', error)
      }
    }

    fetchUserId()
  }, [])

  // Fetch posts when userId is available
  useEffect(() => {
    if (userId) {
      fetchPosts()
    }
  }, [userId]) // Dependency array includes userId

  const handleSaveClick = async (postIndex) => {
    if (!userId) {
      console.error('User ID is not available')
      return
    }

    const updatedPosts = [...posts]
    const post = updatedPosts[postIndex]

    // Check if the user has already saved the post
    const userIndex = post.saves.users.indexOf(userId)
    const isSaved = userIndex !== -1

    try {
      let response

      if (isSaved) {
        // User already saved the post, remove the save
        response = await fetch(`http://localhost:3001/api/posts/${post._id}/${userId}/unsave`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } else {
        // User has not saved the post yet, add the save
        response = await fetch(`http://localhost:3001/api/posts/${post._id}/${userId}/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update save status')
      }

      // Update local state
      if (isSaved) {
        post.saves.users.splice(userIndex, 1) // Remove user from saves array
        post.saved = false
      } else {
        post.saves.users.push(userId) // Add user to saves array
        post.saved = true
      }

      setPosts(updatedPosts) // Trigger re-render
      // fetchPosts()
      location.reload() // Refresh posts list
    } catch (error) {
      console.error('Error updating save status:', error)
    }
  }
  const handleShare = async (postIndex) => {
    if (!userId) {
      console.error('User ID is not available')
      return
    }

    const updatedPosts = [...posts]
    let sharePostData = {}
    try {
      if (posts[postIndex].shared) {
        sharePostData = {
          shared_post: {
            original_owner: posts[postIndex].shared_post.original_owner,
            original_post: posts[postIndex].shared_post.original_post,
          },
        }
      } else {
        sharePostData = {
          shared_post: {
            original_owner: posts[postIndex].user_id,
            original_post: posts[postIndex]._id,
          },
        }
      }

      const response = await fetch(`http://localhost:3001/api/posts/${userId}/post/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sharePostData),
      })

      const data = await response.json()
      if (response.ok) {
        setSharePost({ shared_post: { original_owner: '', original_post: '' } })
        updatedPosts[postIndex] = {
          ...updatedPosts[postIndex],
          shared: true,
          shared_post: sharePostData.shared_post,
        }
      } else {
        throw new Error(data.error || 'Failed to update like status')
      }
    } catch (error) {
      console.error('Error updating share status:', error)
    }

    // Update the local state
    setPosts(updatedPosts)
    location.reload()
  }

  const handleDeleteClick = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${postId}/post/delete`, {
        method: 'DELETE',
      })
      if (response.ok) {
        fetchPosts()
      } else {
        console.error('Failed to delete the post.')
      }
    } catch (error) {
      console.error('Error deleting the post:', error)
    }
  }

  const handleEditClick = (index) => {
    const newPosts = [...updatedPosts]
    newPosts[index].isEditing = true
    setUpdatedPosts(newPosts)
  }

  const handleEditChange = (index, field, value) => {
    const newPosts = [...updatedPosts]
    newPosts[index][field] = value
    setUpdatedPosts(newPosts)
  }

  const handleSaveEdit = async (index) => {
    const post = updatedPosts[index]
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${post._id}/post/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: post.text,
          tags: post.tags,
          game: post.game,
          platform: post.platform,
        }),
      })
      if (response.ok) {
        const newPosts = [...updatedPosts]
        newPosts[index].isEditing = false
        setUpdatedPosts(newPosts)
      } else {
        console.error('Failed to update post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
    }
  }

  const handleCancelEdit = (index) => {
    const newPosts = [...updatedPosts]
    newPosts[index].isEditing = false
    setUpdatedPosts(newPosts)
  }

  const handleLikeClick = async (postIndex) => {
    if (!userId) {
      console.error('User ID is not available')
      return
    }
    const updatedPosts = [...posts]
    const post = updatedPosts[postIndex]

    // Check if the user has already liked the post
    const userIndex = post.likes.users.indexOf(userId)
    const isLiked = userIndex !== -1

    // Update local state
    if (isLiked) {
      // User already liked the post, remove the like
      try {
        const response = await fetch(
          `http://localhost:3001/api/posts/${posts[postIndex]._id}/${userId}/unlike`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to update like status')
        }
      } catch (error) {
        console.error('Error updating like status:', error)
      }
      post.liked = false
    } else {
      // User has not liked the post yet, add the like
      // Send the updated like status to the server
      try {
        const response = await fetch(
          `http://localhost:3001/api/posts/${posts[postIndex]._id}/${userId}/like`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to update like status')
        }
      } catch (error) {
        console.error('Error updating like status:', error)
      }
      post.liked = true
    }

    // Update the local state
    setPosts(updatedPosts)
    fetchPosts()
  }

  useEffect(() => {
    const fetchOriginalPostsAndUserData = async () => {
      const newPosts = await Promise.all(
        posts.map(async (post) => {
          let updatedPost = { ...post }
          if (post.shared) {
            console.log('post:', post)
            try {
              const response = await fetch(
                `http://localhost:3001/api/posts/${post.shared_post.original_post}/post`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              )
              const data = await response.json()

              if (response.ok) {
                updatedPost = {
                  ...updatedPost,
                  text: data.text,
                  tags: data.tags,
                  game: data.game,
                  platform: data.platform,
                }
              }
            } catch (error) {
              console.error('Error fetching original post:', error)
            }

            try {
              const og_userResponse = await fetch(
                `http://localhost:3001/api/users/${post.shared_post.original_owner}/data`
              )
              const original_data = await og_userResponse.json()

              if (og_userResponse.ok) {
                updatedPost = {
                  ...updatedPost,
                  og_user: original_data.nickname,
                  avatar: original_data.avatar,
                }
              }
            } catch (error) {
              console.error('Error fetching original user data:', error)
            }
          }

          try {
            const userResponse = await fetch(`http://localhost:3001/api/users/${post.user_id}/data`)
            const userData = await userResponse.json()

            if (userResponse.ok) {
              updatedPost = { ...updatedPost, userNickname: userData.nickname, avatar: userData.avatar }
            }
          } catch (error) {
            console.error('Error fetching user data:', error)
          }

          return updatedPost
        })
      )
      setUpdatedPosts(newPosts)
      setIsLoading(false)
    }

    fetchOriginalPostsAndUserData()
  }, [posts])

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-lg">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingOverlay />
          </div>
        ) : (
          updatedPosts.map((post, index) => (
            <div key={index} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-black">
              <div>
                <Link href={`/HomePage/Profile/${post.user_id}`}>
                  {' '}
                  <Image
                    src={post.avatar}
                    alt="User avatar"
                    height={100}
                    width={100}
                    className="left-0 rounded-xl"
                  />
                  {post.userNickname}
                </Link>
                {post.shared && (
                  <>
                    <span> has shared from: </span>
                    <Link href={`/HomePage/Profile/${post.shared_post.original_owner}`}>{post.og_user}</Link>
                  </>
                )}
              </div>

              {/* Conditionally render edit form or post details */}
              {post.isEditing ? (
                <div>
                  <textarea
                    value={post.text}
                    onChange={(e) => handleEditChange(index, 'text', e.target.value)}
                    className="w-full mb-2 p-2 border rounded bg-white focus:bg-green-100"
                  />
                  <input
                    type="text"
                    value={post.tags.join(', ')}
                    onChange={(e) =>
                      handleEditChange(
                        index,
                        'tags',
                        e.target.value.split(',').map((tag) => tag.trim())
                      )
                    }
                    className="w-full mb-2 p-2 border rounded bg-white focus:bg-green-100"
                    placeholder="Tags"
                  />
                  <input
                    type="text"
                    value={post.game.join(', ')}
                    onChange={(e) =>
                      handleEditChange(
                        index,
                        'game',
                        e.target.value.split(',').map((game) => game.trim())
                      )
                    }
                    className="w-full mb-2 p-2 border rounded bg-white focus:bg-green-100"
                    placeholder="Games"
                  />
                  <input
                    type="text"
                    value={post.platform.join(', ')}
                    onChange={(e) =>
                      handleEditChange(
                        index,
                        'platform',
                        e.target.value.split(',').map((platform) => platform.trim())
                      )
                    }
                    className="w-full mb-2 p-2 border rounded bg-white focus:bg-green-100 "
                    placeholder="Platforms"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveEdit(index)}
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleCancelEdit(index)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p>Text: {post.text ? post.text : 'post unavailable'}</p>
                  <p>Tags: {post.tags ? post.tags.join(', ') : 'post unavailable'}</p>
                  <p>Games: {post.game ? post.game.join(', ') : 'post unavailable'}</p>
                  <p>Platforms: {post.platform ? post.platform.join(', ') : 'post unavailable'}</p>
                  <p>{post.original_owner}</p>
                </>
              )}

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                  <button onClick={() => handleLikeClick(index)}>
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`mr-2 transition-colors duration-300 ${
                        post.likes.users.indexOf(userId) !== -1 ? 'text-green-500' : 'text-gray-500'
                      }`}
                    />
                  </button>
                  <span>{post.likes.count}</span>
                </div>
                <div className="flex items-center">
                  <button onClick={() => handleSaveClick(index)}>
                    <FontAwesomeIcon
                      icon={faBookmark}
                      className={`mr-2 transition-colors duration-300 ${
                        post.saves.users.indexOf(userId) !== -1 ? 'text-blue-500' : 'text-gray-500'
                      }`}
                    />
                  </button>
                  <span>{post.saves.count}</span>
                </div>
                <div className="flex items-center">
                  <button onClick={() => handleShare(index)}>
                    <FontAwesomeIcon
                      icon={faShare}
                      className={`mr-2 transition-colors duration-300 ${
                        post.shares.users.indexOf(userId) !== -1 ? 'text-blue-500' : 'text-gray-500'
                      }`}
                    />
                  </button>
                  <span>{post.shares.count}</span>
                </div>
                {/* Conditional Edit and Delete Buttons */}
                {post.user_id === userId && (
                  <div className="flex items-center bg-white text-white ">
                    <button onClick={() => handleEditClick(index)}>
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="text-yellow-500 transition-colors duration-300  hover:text-yellow-700 mr-2"
                      />
                    </button>
                    <button onClick={() => handleDeleteClick(post._id)}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-red-500 transition-colors duration-300 hover:text-red-700"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
