'use client'
import { useState, useEffect } from 'react'
import { getSessionData } from '../actions'
import LoadingOverlay from '../components/loading'

export default function NewPost() {
  const [newPost, setNewPost] = useState({
    tags: [],
    game: [],
    platform: [],
    text: '',
  })

  const [imagePreview, setImagePreview] = useState(null) // State for image preview
  const [imageFile, setFile] = useState(null)
  const [userId, setUserId] = useState(null)

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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'tags' || name === 'game' || name === 'platform') {
      setNewPost({ ...newPost, [name]: value.split(',') })
    } else {
      setNewPost({ ...newPost, [name]: value })
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    setImagePreview(URL.createObjectURL(file)) // Create a preview URL
    setFile(file)
  }

  const handlePosts = async (e) => {
    e.preventDefault()
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (!userId) {
      console.error('User ID is not available')
      return
    }

    const response = await fetch(`http://localhost:3001/api/posts/${userId}/post/insert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })

    const data = await response.json()
    if (response.ok) {
      console.log('data:', data)

      if (imageFile) {
        const ImageData = new FormData()
        ImageData.append('image', imageFile)

        const imageResponse = await fetch(`http://localhost:3001/api/posts/${data.post_id}/files/upload`, {
          method: 'POST',
          body: ImageData,
        })

        const imageResponseData = await imageResponse.json()
        if (imageResponse.ok) {
          console.log('Image uploaded successfully:', imageResponseData)
        } else {
          console.log('Image upload failed:', imageResponseData.error)
        }
      }

      setNewPost({
        tags: [],
        game: [],
        platform: [],
        text: '',
        image: null,
      })
      setImagePreview(null) // Clear the image preview
      alert(JSON.stringify(data))
      location.reload()
    } else {
      alert(JSON.stringify(data))
      console.log('Post failed to upload:', data.error)
    }
  }

  if (!newPost) return <LoadingOverlay />
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-xl ">
        <form onSubmit={handlePosts} className="bg-[#16303b] shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-400  text-sm font-bold mb-2" htmlFor="text">
              {/* {'Post a new message'} */}
            </label>
            <input
              id="text"
              name="text"
              type="text"
              value={newPost.text}
              onChange={handleInputChange}
              placeholder="Post a new message"
              className="w-full px-4 py-2 border-b-2 border-gray-300 rounded-none  text-green-200 placeholder-gray-400 focus:border-b-4 focus:border-green-500 focus:outline-none transition-all duration-300 ease-in-out bg-transparent"
            />
          </div>
          {/* Image upload section */}

          {/* Other input fields */}
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="tags">
              {/* Tags (comma separated) */}
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={newPost.tags.join(',')}
              onChange={handleInputChange}
              placeholder="Tags (comma separated)"
              className="w-full px-4 py-2 border-b-2 border-gray-300 rounded-none  text-green-200 placeholder-gray-400 focus:border-b-4 focus:border-green-500 focus:outline-none transition-all duration-300 ease-in-out bg-transparent"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="game">
              {/* Games (comma separated) */}
            </label>
            <input
              id="game"
              name="game"
              type="text"
              value={newPost.game.join(',')}
              onChange={handleInputChange}
              placeholder="Games (comma separated)"
              className="w-full px-4 py-2 border-b-2 border-gray-300 rounded-none  text-green-200 placeholder-gray-400 focus:border-b-4 focus:border-green-500 focus:outline-none transition-all duration-300 ease-in-out bg-transparent"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="platform">
              {/* Platforms (comma separated) */}
            </label>
            <input
              id="platform"
              name="platform"
              type="text"
              value={newPost.platform.join(',')}
              onChange={handleInputChange}
              placeholder="Platforms (comma separated)"
              className="w-full px-4 py-2 border-b-2 border-gray-300 rounded-none  text-green-200 placeholder-gray-400 focus:border-b-4 focus:border-green-500 focus:outline-none transition-all duration-300 ease-in-out bg-transparent"
            />
          </div>
          <div className="mb-4 pt-2 flex-col flex">
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="w-40 cursor-pointer py-2 px-7 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
            >
              Upload Image
            </label>
            {imagePreview && (
              <div className=" mt-4">
                <img src={imagePreview} alt="Image Preview" className="w-full h-auto rounded" />
              </div>
            )}
          </div>
          <div className="flex">
            <button
              type="submit"
              className="ml-80 w-40 mt-5 ml-5 bg-green-600 hover:bg-green-800 transition-all duration-300 ease-in-out text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
