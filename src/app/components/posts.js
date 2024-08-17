'use client'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { getSessionData } from '../actions'
import Link from 'next/link'
import LoadingOverlay from '../components/loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faBookmark, faShare, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

export default function Posts({ keyPost, item = null, category = null }) {
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

  async function sendNotification(user, clickedId, notType) {
    const response2 = await fetch(
      `http://localhost:3001/api/users/${user}/${clickedId}/notification/${notType}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }
    )
    const data2 = await response2.json()
  }

  const fetchPosts = async () => {
    try {
      if (keyPost === 'following') {
        const response = await fetch(
          `https://gamegrid-server.onrender.com/api/posts/${userId}/${keyPost}/posts`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        const data = await response.json()
        if (response.ok) {
          setPosts(data.posts_list)
        } else {
        }
      }

      if (keyPost === 'all') {
        const response = await fetch(`https://gamegrid-server.onrender.com/api/posts/${keyPost}posts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()
        if (response.ok) {
          let post_data = data.posts_list

          if (item !== null && category !== null) {
            let tag_posts = []
            if (category === 'tags') {
              post_data.forEach((post) => {
                if (typeof post.tags !== 'undefined' && post.tags.includes(item)) {
                  tag_posts.push(post)
                }
              })
              setPosts(tag_posts)
            } else if (category === 'game') {
              post_data.forEach((post) => {
                if (typeof post.game !== 'undefined' && post.game.includes(item)) {
                  tag_posts.push(post)
                }
              })
              setPosts(tag_posts)
            } else if (category === 'platform') {
              post_data.forEach((post) => {
                if (typeof post.platform !== 'undefined' && post.platform.includes(item)) {
                  tag_posts.push(post)
                }
              })
              setPosts(tag_posts)
            }
          } else {
            setPosts(post_data)
          }
        } else {
        }
      }

      if (keyPost === 'MyPost') {
        const response = await fetch(`https://gamegrid-server.onrender.com/api/posts/${userId}/posts`, {
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
        }
      }
      if (keyPost === 'MySaved') {
        const response = await fetch(`https://gamegrid-server.onrender.com/api/posts/${userId}/saved`, {
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
        }
      }

      if (keyPost === 'MyLiked') {
        const response = await fetch(`https://gamegrid-server.onrender.com/api/posts/${userId}/liked`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        if (response.ok) {
          let post_data = data.liked_post_list

          setPosts(post_data)
        } else {
        }
      } else if (keyPost !== 'all' && keyPost !== 'MySaved') {
        const response = await fetch(`https://gamegrid-server.onrender.com/api/posts/${keyPost}/posts`, {
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
        response = await fetch(
          `https://gamegrid-server.onrender.com/api/posts/${post._id}/${userId}/unsave`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      } else {
        // User has not saved the post yet, add the save
        response = await fetch(`https://gamegrid-server.onrender.com/api/posts/${post._id}/${userId}/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        sendNotification(post.user_id, userId, 'save')
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

      const response = await fetch(`https://gamegrid-server.onrender.com/api/posts/${userId}/post/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sharePostData),
      })

      const data = await response.json()
      if (response.ok) {
        sendNotification(posts[postIndex].user_id, userId, 'shared')
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
    // sleep(5000)
    location.reload()
  }

  const handleDeleteClick = async (postId) => {
    try {
      const response = await fetch(`https://gamegrid-server.onrender.com/api/posts/${postId}/post/delete`, {
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
      const response = await fetch(`https://gamegrid-server.onrender.com/api/posts/${post._id}/post/update`, {
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
          `https://gamegrid-server.onrender.com/api/posts/${posts[postIndex]._id}/${userId}/unlike`,
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
          `https://gamegrid-server.onrender.com/api/posts/${posts[postIndex]._id}/${userId}/like`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        const data = await response.json()
        sendNotification(post.user_id, userId, 'like')

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
        posts?.map(async (post) => {
          let updatedPost = { ...post }
          if (post?.shared) {
            try {
              const response = await fetch(
                `https://gamegrid-server.onrender.com/api/posts/${post.shared_post.original_post}/post`,
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
                  media: data.media,
                }
              }
            } catch (error) {
              console.error('Error fetching original post:', error)
            }

            try {
              const og_userResponse = await fetch(
                `https://gamegrid-server.onrender.com/api/users/${post.shared_post.original_owner}/data`
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
            const userResponse = await fetch(
              `https://gamegrid-server.onrender.com/api/users/${post.user_id}/data`
            )
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

  const ButtonList = ({ list, category }) => {
    return (
      <div className="transparent flex space-x-2">
        {list.map((item, index) => (
          <button
            onClick={() => (window.location.href = `/HomePage/categories/${category}/${item}`)}
            key={index}
            className="px-2 py-1 text-sm text-white-800 bg-transparent border border-gray-800 rounded-md hover:bg-gray-200"
          >
            {category === 'tags' ? '#' + item : item}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-transparent py-8">
      <div className="w-full max-w-2xl">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingOverlay />
          </div>
        ) : (
          updatedPosts.map((post, index) => (
            <div
              key={index}
              /* Main Div */
              className=" bg-gray-600 bg-opacity-50 p-6 mt-8 shadow-lg rounded-lg overflow-hidden mb-6 flex flex-col justify-between"
            >
              <div className="p-6 flex">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Link href={`/HomePage/Profile/${post.user_id}`}>
                      <Image
                        src={post.avatar}
                        alt="User avatar"
                        height={50}
                        width={50}
                        className="rounded-full mr-4"
                      />
                    </Link>
                    <div>
                      <Link
                        href={`/HomePage/Profile/${post.user_id}`}
                        className="font-bold text-lg text-white"
                      >
                        {post.userNickname}
                      </Link>
                      {post.shared && (
                        <div className="text-sm text-green-300">
                          <span> has shared from: </span>
                          <Link
                            href={`/HomePage/Profile/${post.shared_post.original_owner}`}
                            className="text-green-300 font-bold"
                          >
                            {post.og_user}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Outer div for both text,image */}
                  <div className="flex flex-row mt-5 space-x-32">
                    {/* div for text */}
                    <div className="w-60">
                      {post.isEditing ? (
                        <div>
                          <textarea
                            value={post.text}
                            onChange={(e) => handleEditChange(index, 'text', e.target.value)}
                            className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 text-black"
                            rows={4}
                            placeholder="Write your thoughts..."
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
                            className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 text-black"
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
                            className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 text-black"
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
                            className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 text-black"
                            placeholder="Platforms"
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleSaveEdit(index)}
                              className="bg-blue-600 px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition text-black"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => handleCancelEdit(index)}
                              className="bg-gray-600 px-6 py-2 rounded-lg shadow ml-2 hover:bg-gray-700 transition text-black"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-300 text-2xl mb-7">{post.text}</p>
                          <div className="text-xl mb-2 text-gray-300">
                            <strong>Tags:</strong> <ButtonList list={post.tags} category="tags" />
                          </div>
                          <div className="text-xl mb-2 text-gray-300">
                            <strong>Games:</strong>
                            <ButtonList list={post.game} category="game" />
                          </div>
                          <div className="text-xl mb-2 text-gray-300">
                            <strong>Platforms:</strong>
                            <ButtonList list={post.platform} category="platform" />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* div for image */}
                    {post.media && post.media.length > 0 && (
                      <div className="">
                        {post.media.map((image, idx) => (
                          <Image
                            key={idx}
                            src={image}
                            alt={`Post image ${idx + 1}`}
                            height={10000000000}
                            width={100000000000}
                            className="w-80 h-60 rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <button onClick={() => handleLikeClick(index)}>
                        <FontAwesomeIcon
                          icon={faHeart}
                          className={`mr-2 transition-colors duration-300 ${
                            post.likes?.users.indexOf(userId) !== -1 ? 'text-red-500' : 'text-gray-300'
                          }`}
                        />
                      </button>
                      <span className="text-white">{post.likes?.count}</span>
                    </div>
                    <div className="flex items-center">
                      <button onClick={() => handleSaveClick(index)}>
                        <FontAwesomeIcon
                          icon={faBookmark}
                          className={`mr-2 transition-colors duration-300 ${
                            post.saves?.users.indexOf(userId) !== -1 ? 'text-blue-500' : 'text-gray-300'
                          }`}
                        />
                      </button>
                      <span className="text-white">{post.saves?.count}</span>
                    </div>
                    <div className="flex items-center">
                      <button onClick={() => handleShare(index)}>
                        <FontAwesomeIcon
                          icon={faShare}
                          className={`mr-2 transition-colors duration-300 ${
                            post.shares?.users.indexOf(userId) !== -1 ? 'text-green-500' : 'text-gray-300'
                          }`}
                        />
                      </button>
                      <span className="text-white">{post.shares?.count}</span>
                    </div>
                    {post.user_id === userId && (
                      <div className="flex items-center">
                        <button onClick={() => handleEditClick(index)} disabled={post.shared}>
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="text-yellow-500 transition-colors duration-300 hover:text-yellow-700 mr-2"
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
                    <div className="text-center text-white font-semibold text-sm mt-2 mb-2">
                      <p>{new Date(post.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
