import Head from 'next/head'
import Header from "../components/Header.js"
import { useState, useEffect } from 'react'
import { Heading, Typography } from '@ensdomains/thorin'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, ABI } from '../contracts/CommitManager.ts'
import { useProvider } from 'wagmi'
import toast, { Toaster } from 'react-hot-toast'

export default function Treasury() {

  // variables
  const provider = useProvider()
  
  // state
  const [balanceContract, setBalanceContract] = useState(null)
  
  // functions
  function formatUsd(number) {
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })
  }
  
  async function getSmartContractBalance() {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const balance = await provider.getBalance(CONTRACT_ADDRESS)
        setBalanceContract(parseFloat((Number(ethers.utils.formatEther(balance)))))
      }
    } catch (err) {
      console.error("Error getting smart contract balance: ", err)
      return null
    }
  }

  useEffect(() => {
    getSmartContractBalance()
  }, [])

  // rendering
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

      <Header currentPage="treasury" />

      <div className="flex h-screen">
        <div className="container container--flex">
         {/* <CurrencyToggle /> */}
          <div className="flex flex-row gap-5 mt-8">
            <div className="flex flex-col justify-center mt-4 lg:mt-0">
              <img className="h-16" src="./polygon-logo-tilted.svg" />
            </div>
            <div className="heading">
              <Heading level="1" style={{ fontWeight: "400", letterSpacing: "0.014em" }}>
                {balanceContract}
              </Heading>
            </div>
          </div>
          <div className="flex flex-row w-4/5 mt-10 lg:mb-6 lg:justify-center" style={{ }}>
            <Typography className="" font="sans" variant="large" style={{ lineHeight: "1.5" }}>
              Just Commit ⚡ <b>Treasury</b>
            </Typography>
          </div>
          <div className="flex flex-row w-4.5/5 mt-4 lg:justify-center lg:align-center">
            <Typography className="text-xs" weight="normal" font="sans" style={{ lineHeight: "1.5" }}>
              This is all of the failed commitments money.
              <br />
              Soon to be goverened by the <b>Just Commit DAO.</b>
            </Typography>
          </div>
          
          {/* Table
          <div class="mt-10 border border-gray-300 p-1"
               style = {{minHeight: "50vh", minWidth: "80vw"}}
          >
            <div>
              <div className="flex flex-row text-center text-sm gap-2 mt-2">
                <div class="w-3/5">Heterodox Academy</div>
                <div className="flex flex-row w-1/5">
                  <div className="flex flex-col align-center justify-center mr-1">
                    <img className="h-4" src="./polygon-logo-tilted.svg" />
                  </div>
                  <div>20</div>
                </div>
                <div class="w-1/10">
                  <a className="w-1/2 justify-center font-medium text-blue-600 align-center p-0.5
                                text-l rounded-lg bg-sky-200 hover:bg-sky-400 hover:cursor-pointer"
                    onClick={() => { toast("⏳ Coming Soon...", { id: 'unique' }) }}>
                      &nbsp;&nbsp;&nbsp;🗳️&nbsp;&nbsp;&nbsp;
                  </a>
                </div>
                <div className="w-1/10">
                  <a className="w-1/2 justify-center font-medium text-blue-600 align-center p-0.5
                                text-l rounded-lg bg-sky-200 hover:bg-sky-400 hover:cursor-pointer"
                    onClick={() => { toast("⏳ Coming Soon...", { id: 'unique' }) }}>
                      &nbsp;&nbsp;&nbsp;🔎&nbsp;&nbsp;&nbsp;
                  </a>
                </div>
              </div>
            </div>
          </div>
        */ }
          
        </div>
      </div>
    </>
  )
}
