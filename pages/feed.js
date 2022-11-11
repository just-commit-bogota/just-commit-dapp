import Head from 'next/head'
import Header from "../components/Header.js"

export default function Feed() {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Just Commit</title>
        <meta property="og:title" content="Just Commit" />
        <meta name="description" content="Just Commit" />
        <meta property="og:description" content="Just Commit" />
        <link rel="icon" type="image/png" sizes="16x16" href="./favicon-16.ico" />
      </Head>
      
      <Header />
      <div className = "w-9/10 sm:w-1/2 mx-auto mt-20 p-8">
        <div className = "text-2xl font-semibold flex justify-center">
          ⏳ Working on it.
        </div>
      </div>
    </>
  )
}
