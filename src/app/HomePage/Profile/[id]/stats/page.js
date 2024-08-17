'use client'
import Posts from '@/app/components/posts'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import LoadingOverlay from '@/app/components/loading'

export default function ProfileStats({ params }) {
  const [statsData, setStats] = useState()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`http://gamegrid-server.onrender.com/api/users/${params.id}/data`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const user = await userResponse.json()

        const postsResponse = await fetch(
          `http://gamegrid-server.onrender.com/api/posts/${params.id}/posts`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        const posts = await postsResponse.json()

        if (userResponse.ok && postsResponse.ok) {
          // setUserData(user)

          const stats = [
            { title: 'Published Posts', value: posts.posts_list.length },
            { title: 'Likes Received', value: user.social.total_likes },
            { title: 'Shares Received', value: user.social.total_share },
            { title: 'Saves Received', value: user.social.total_saves },
            { title: 'Followers', value: user.social.followers.length },
            { title: 'Following', value: user.social.following.length },
          ]
          setStats(stats)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [])

  if (!statsData) {
    return (
      <div className="min-h-screen flex flex-col items-center w-full mt-50">
        <LoadingOverlay />
      </div>
    )
  }
  const StatCard = ({ title, value }) => {
    return (
      <div className="bg-gray-800 p-4 rounded-lg text-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    )
  }
  const UserStats = ({ stats }) => {
    return (
      <div className=" p-6 bg-gray-900 text-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">User Stats</h1>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} title={stat.title} value={stat.value} />
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen flex flex-col items-center w-full mt-20">
      <UserStats stats={statsData} />
    </div>
  )
}
