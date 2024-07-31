'use server'
import Head from "next/head"
import Posts from "../components/posts"
import { getSessionData } from "../actions"

export default async function HomePage() {
    return (
        <div className="min-h-screen flex-auto w-full  ">
          <Head>
            <title>Lobby</title>
          </Head>
          <Posts userId={getSessionData()}/>
        </div>
      )
}

