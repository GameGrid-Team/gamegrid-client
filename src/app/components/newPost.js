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
      <div className="w-full max-w-xl">
        <form onSubmit={handlePosts} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="text">
              {'Post a new message'}
            </label>
            <input
              id="text"
              name="text"
              type="text"
              value={newPost.text}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white focus:bg-green-100"
            />
          </div>
          {/* Image upload section */}
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="image">
              Upload Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white focus:bg-green-100"
            />
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Image Preview" className="w-full h-auto rounded" />
              </div>
            )}
          </div>
          {/* Other input fields */}
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="tags">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={newPost.tags.join(',')}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white focus:bg-green-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="game">
              Games (comma separated)
            </label>
            <input
              id="game"
              name="game"
              type="text"
              value={newPost.game.join(',')}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white focus:bg-green-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black text-sm font-bold mb-2" htmlFor="platform">
              Platforms (comma separated)
            </label>
            <input
              id="platform"
              name="platform"
              type="text"
              value={newPost.platform.join(',')}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white focus:bg-green-100"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
