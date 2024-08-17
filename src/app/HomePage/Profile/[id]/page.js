'use client'
import Posts from '@/app/components/posts'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import FollowButton from '@/app/components/followButton'
import { getSessionData } from '@/app/actions'
import LoadingOverlay from '@/app/components/loading'
import Link from 'next/link'
export default function ProfilePage({ params }) {
  const [userData, setUserData] = useState()
  const [following, setFollowing] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      const id = await getSessionData()
      setUserId(id)
      try {
        const [userResponse, followingResponse] = await Promise.all([
          fetch(`http://gamegrid-server.onrender.com/api/users/${params.id}/data`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
          fetch(`http://gamegrid-server.onrender.com/api/users/${params.id}/list/following`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }),
        ])

        const userData = await userResponse.json()
        const followersData = await followingResponse.json()

        if (userResponse.ok) {
          setUserData(userData)
        }
        if (followingResponse.ok) {
          setFollowing(followersData.following_list)
        }
      } catch (error) {
        console.error('Error fetching user data or followers:', error)
      }
    }
    fetchUserData()
  }, [])

  if (!userData) {
    return (
      <div className="flex items-center h-screen ml-96 p-96">
        <LoadingOverlay />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center w-full">
      <Head>
        <title>Profile</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
      </Head>

      <div className="flex w-full justify-between">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center">
          {/* User Data Section */}
          <div className="w-full max-w-md bg-[#16303b] shadow-md rounded-lg p-6 mb-8 relative">
            <div class="flex space-x-4 justify-center mt-4 absolute left-5">
              <a href={userData.facebook} target="_blank">
                <span class="[&>svg]:h-5 [&>svg]:w-5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 320 512">
                    <path d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                  </svg>
                </span>
              </a>

              <a href={userData.instagram} target="_blank">
                <span class="[&>svg]:h-5 [&>svg]:w-5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                  </svg>
                </span>
              </a>
            </div>

            <Image
              src={userData.avatar}
              alt="User Avatar"
              width={1000000000000}
              height={100000000000}
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />

            <div className="p-6 max-w-lg mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-4 -mt-6">{userData.nickname}</h3>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Image
                    src={userData.social.rank.rank_image_url}
                    alt="Rank Image"
                    width={100000}
                    height={100000}
                    className="w-20 h-20 rounded-full -mb-5"
                  />
                </div>

                <h3 className="text-xl font-semibold -mt-3">{userData.social.rank.rank_name}</h3>
              </div>
            </div>
            <div className="mt-4 ">
              <p className="text-lg ">{userData.bio}</p>
            </div>

            {/* Rank progress gauge section */}
            <div className="mt-4">
              <h3 className="text-lg font-medium text-center mb-2">Rank Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(userData.social.rank.exp / userData.social.rank.next_rank) * 100}%` }}
                ></div>
              </div>
              <p className="text-center mt-2">
                {userData.social.rank.exp} / {userData.social.rank.next_rank}
              </p>
            </div>
            <div className="absolute top-4 right-4">
              {userId === params.id ? (
                ''
              ) : (
                <FollowButton
                  userId={userId}
                  followId={params.id}
                  initialIsFollowing={userData.social.followers.includes(userId)}
                />
              )}
            </div>
          </div>

          {/* Posts Section */}
          <div className="w-full max-w-2xl">
            <Posts keyPost={params.id} />
          </div>
        </div>

        {/* Following Section - Centered Vertically and Aligned to the Right */}
        <div className=" w-96 bg-secondary shadow-md rounded-lg p-6 mb-8 absolute right-0 top-1/2 transform -translate-y-1/2 mr-4 ">
          <h3 className="text-xl font-bold mb-4">Following List</h3>
          <ul>
            {following.length > 0 ? (
              following.map((follower) => (
                <li key={follower?._id}>
                  {/* outer div */}
                  <div className=" justify-between flex items-center mb-3">
                    {/* link names and avatar */}
                    <div className="flex items-center">
                      <Link href={`/HomePage/Profile/${follower?._id}`}>
                        <Image
                          src={follower?.avatar}
                          alt={follower?.nickname}
                          width={10000000}
                          height={1000000}
                          className="rounded-full w-14 h-14"
                        />
                      </Link>
                      <Link href={`/HomePage/Profile/${follower?._id}`}>
                        <p
                          title={follower?.nickname.length > 10 ? follower?.nickname : ''}
                          className="text-lg font-medium pl-4 pr-4"
                        >
                          {follower?.nickname.length > 12
                            ? `${follower?.nickname.slice(0, 12)}...`
                            : follower?.nickname}
                        </p>
                      </Link>
                    </div>
                    {/* <span title={user.nickname.length > 10 ? user.nickname : ''}>
                            {user.nickname.length > 10 ? `${user.nickname.slice(0, 10)}...` : user.nickname}
                          </span> */}
                    {/* follow button */}
                    <div className=" bg-sky-800">
                      <FollowButton
                        userId={userId}
                        followId={follower?._id}
                        initialIsFollowing={follower?.social.followers.includes(userId)}
                      />
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p>No followers found.</p>
            )}
          </ul>

          {/* Follow Teammate Button */}
          {/* <button className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Follow Teammate
          </button> */}
        </div>
      </div>
    </div>
  )
}
