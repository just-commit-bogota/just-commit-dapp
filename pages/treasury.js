import Head from 'next/head'
import Header from "../components/Header.js"
import { useState, useEffect } from 'react'
import { Heading, Typography } from '@ensdomains/thorin'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, ABI } from '../contracts/CommitManager.ts'
import { useProvider } from 'wagmi'

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
    console.log(balanceContract)
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
{/*           <CurrencyToggle /> */}
          <div className="flex flex-row gap-5 mt-4">
            <div className="flex flex-col justify-center mt-4">
              <img className="h-16" src="./polygon-logo-tilted.svg" />
            </div>
            <div className="heading">
              <Heading level="1" style={{ fontWeight: "400", letterSpacing: "0.014em" }}>
                {balanceContract}
              </Heading>
            </div>
          </div>
          <div className="mt-2 italic">
            <Typography weight="light" font="sans" style={{ lineHeight: "1.5" }}>
              Total amount of money in the smart contract<br />(from failed commitments).
            </Typography>
          </div>
        </div>
      </div>
    </>
  )
}
