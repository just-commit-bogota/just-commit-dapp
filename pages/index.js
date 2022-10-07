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
        <title>Productivity dApp</title>
        <meta property="og:title" content="Productivity dApp" />
        <meta name="description" content="Productivity dApp" />
        <meta property="og:description" content="Productivity dApp" />
      </Head>

      <div className="bg-gradient-to-b from-emerald-100 to-white-500 min-h-screen">
        <div className="home-page mx-auto py-3">
          <div className="container mx-auto flex items-center justify-between absolute mt-6 ml-6">
            <div className="text-4xl cursor-default text-black font-semibold ml-6">
              Productivity dApp
            </div>
            <div>
              <ConnectButton className="mr-2 md:inline-flex hover:shadow-lg flex " />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
