import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Just Commit</title>
        <meta property="og:title" content="Just Commit" />
        <meta name="description" content="Just Commit" />
        <meta property="og:description" content="Just Commit" />
      </Head>

      <div className="header header--absolute bg-white">
        <div className="text-4xl cursor-default text-black font-semibold ml-6">
          Just Commit
        </div>
        <div>
          <ConnectButton className="mr-2 md:inline-flex hover:shadow-lg flex" />
        </div>
      </div>
      <div className="bg-gradient-to-b from-GREEN-100 to-white-500 min-h-screen">
      </div>
    </>
  )
}

{/*
(TODO: update to include the @media overrides)
(TODO: figure out how to do tailwindCSS for below header CSS code)
(TODO: add "Home" and "Feed" tabs)


// contains the h1 text, the form and the commits array render
.container {
  max-width: 80rem;
  margin: 0 auto;
}
.container--flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  margin-top: 10 rem;
}

.heading {
  margin-bottom:2rem;
  line-height:1;
}
*/}