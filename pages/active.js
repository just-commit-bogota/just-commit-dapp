import Head from 'next/head'
import Header from "../components/Header.js"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Placeholders } from "../components/Placeholders.js"

export default function Active() {

  const [loadingState, setLoadingState] = useState('loading')

  useEffect(() => {
    setTimeout(() => {
      setLoadingState('loaded')
    }, 1000);
  }, []);

  {/*

  // 👇🏼 this certainly does not work
  
  // state
  const [activeCommits, setActiveCommits] = useState()

  // functions
  function activeCommitsFiltering({commitArray}) {
    let newArray = [];
    for (let commit of commitArray) {
      if (commit.status == "Active") {
        newArray.push(commit)
      }
      return (newArray)
    }
  }

  */}

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
      
      <Header dropdownLabel = <Link href="./active">&emsp;&emsp;&emsp;Active&emsp;&emsp;&emsp;</Link> />
      
      <div className= "w-8/10 sm:w-1/2 mx-auto p-10 mt-20">
        <div className= "flex flex-col justify-center">
          {
            loadingState === 'loading' && <Placeholders loadingStyle = "feedLoadingStyle" number = {1} />
          }
          {
            loadingState === 'loaded' && (
              <div className = "w-9/10 sm:w-1/2 mx-auto mt-20 p-8">
                <div className = "text-2xl font-semibold flex justify-center">
                  ⏳ Working on it.
                </div>
              </div>
            )
          }
        </div>
      </div>
    </>
  )
}

