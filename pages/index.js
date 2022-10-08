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
      
      <div className="container container--flex bg-gradient-to-b from-green-100 to-white-500">
        <div className="heading text-3xl text-left">
          Make a commitment
        </div>
      </div>
    </>
  )
}

{/*
(TODO: update to include the @media overrides)
(TODO: figure out how to do tailwindCSS for below header CSS code)
(TODO: add "Home" and "Feed" tabs)


// contains the h1 text, the form and the commits array render


*/}