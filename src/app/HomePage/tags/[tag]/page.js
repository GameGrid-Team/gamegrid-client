'use server'
import Head from 'next/head'
import Posts from '../../../components/posts'
import NewPost from '../../../components//newPost'

export default async function HomePage({ params }) {
  return (
    <div className="min-h-screen flex-auto w-full  ">
      <Head>
        <title>Tag Page</title>
      </Head>
      <div className="flex justify-center items-center my-4">
        <h3 className="font-bold text-2xl">{`Tag Result: ${params.tag}`}</h3>
      </div>
      <div className="">
        <Posts keyPost={'all'} tag={params.tag} />
      </div>
    </div>
  )
}
