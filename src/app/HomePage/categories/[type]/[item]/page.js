'use server'
import Head from 'next/head'
import Posts from '../../../../components/posts'

export default async function HomePage({ params }) {
  const { type, item } = params

  return (
    <div className="min-h-screen flex-auto w-full  ">
      <Head>
        <title>Tag Page</title>
      </Head>
      <div className="flex justify-center items-center my-4">
        <h3 className="font-bold text-2xl">{`${type} Result: ${item}`}</h3>
      </div>
      <div className="">
        <Posts keyPost={'all'} item={item} type={type} />
      </div>
    </div>
  )
}
