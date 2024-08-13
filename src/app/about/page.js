'use client'
import Header from '../components/Header'
import { useEffect, useState } from 'react'
import LoadingOverlay from '../components/loading'
export default function About() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      //   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/about`)
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/about`)
      const json = await res.json()
      setData(json)
    }

    fetchData()
  }, [])

  if (!data) {
    return <LoadingOverlay />
  }
  return (
    <div className="">
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Header</h1>
        <p>{data.aboutText}</p>
        <p>Some information about us.</p>
      </div>
    </div>
  )
}
