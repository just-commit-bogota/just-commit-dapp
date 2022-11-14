import Head from 'next/head'
import Link from 'next/link'
import Header from "../components/Header.js"
import CommitCard from "../components/CommitCard.js"
import { Placeholders } from "../components/Placeholders.js"
import { useState, useEffect } from 'react'

export default function Feed() {

  const [loadingState, setLoadingState] = useState('loading')

  useEffect(() => {
    setTimeout(() => {
      setLoadingState('loaded')
    }, 1000);
  }, []);
  
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
      
      <Header dropdownLabel = <Link href="./feed">&emsp;&emsp;&emsp;Feed&emsp;&emsp;&emsp;</Link> />
      
      <div className= "w-8/10 sm:w-1/2 mx-auto p-10 mt-20">
        <div className= "flex flex-col justify-center">
          {
            loadingState === 'loading' && <Placeholders loadingStyle = "feedLoadingStyle" number = {6} />
          }
          {
            loadingState === 'loaded' &&
            <CommitCard />
          }
        </div>
      </div>
    </>
  )
}

