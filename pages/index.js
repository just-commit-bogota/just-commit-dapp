import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import abi from "../contracts/CommitManager.json"
import { ethers } from 'ethers'
import { Input, Modal } from '@ensdomains/thorin'
import Button from '@mui/material/Button'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import toast, { Toaster } from 'react-hot-toast'
import { useAccount, useNetwork, useProvider } from 'wagmi'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { useWaitForTransaction } from 'wagmi'
import dayjs from "dayjs";

export default function Home() {

  // state variables
  const [dialogOpen, setDialogOpen] = useState(false)
  const [commitDescription, setCommitDescription] = useState('');
  const [commitTo, setCommitTo] = useState('');
  const [commitAmount, setCommitAmount] = useState('0')
  const [validThrough, setValidThrough] = useState('0')

  // smart contract data
  const provider = useProvider()
  const { chain, chains } = useNetwork()
  const { address: isConnected } = useAccount()
  const contractAddress = "0x28D691d5eDFf71b72B8CA60EDcB164308945707F"

  const { config } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: abi.abi,
    functionName: "createCommit",
    args: [commitDescription,commitTo, validThrough, { value: ethers.utils.parseEther(commitAmount)}]

  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)
  
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

      <div className="header w-full inline-grid justify-between header--absolute bg-white">
        <div className="flex space-x-0 sm:space-x-10 items-center">
          <a className="collapse sm:visible"
            href="./">
            <img src="./logo.png"/>
          </a>
          <a
            className="font-medium p-1 truncate underline underline-offset-4 decoration-[#1DD297] decoration-1
                       hover:decoration-8"
            href="https://danielbelfort.notion.site/Just-Commit-9213dcd452184278a4f628b0e3f48e78"
            target="_blank">
            About
          </a>
        </div>
        <div>
          <ConnectButton className="mr-10 hover:shadow-lg" />
        </div>
      </div>

      <div className="container container--flex">
        <div className="heading text-3xl">
          Make a Commitment
        </div>
        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault()
            // Toast checks
            
            setDialogOpen(true)
          }}      
        >
          <div className="col">
            <Input
              label="Commitment"
              maxLength={140}
              placeholder="strength workout"
              //parentStyles = {{
              //  width: '25rem' }}
                //backgroundColor: '#f1fcf8' }}
              onChange={(e) => setCommitDescription(e.target.value)}
              required
            />
            <Input
              label="To"
              maxLength={42}
              placeholder="0xb443...9aad"
              //parentStyles = {{ backgroundColor: '#f1fcf8' }}
              onChange={(e) => setCommitTo(e.target.value)}
              required
            />
            <Input
              label="Amount"
              placeholder="0.001"
              step = "0.001"
              min = {0}
              type="number"
              units="ETH"
              //parentStyles = {{ backgroundColor: '#f1fcf8' }}
              onChange={(e) => setCommitAmount(e.target.value)}
              required
            />
            {/* TODO: abstract away the UNIX conversion*/}
            <Input
              label="Duration"
              placeholder="1"
              type="number"
              units={((validThrough - dayjs()) / 3600) > 1 ? 'hours' : 'hour'}
              min={1}
              max={10}
              //parentStyles={{ backgroundColor: '#f1fcf8' }}
              onChange={(e) => setValidThrough(e.target.value * 3600 + dayjs())}
              required
            />
          </div>
          
          {/* the Commit button */}
          {!isLoading && (
            <Button style ={{
              width: '32%',
              margin: '1rem',
              backgroundColor: "#1DD297",
              borderRadius: 8,
            }}
            variant="contained"
            onClick={()=> { toast.error('Coming soon! Working on it... ') } }// write();
            >
            Commit
          </Button>
          )}

          <Toaster position="bottom-center" />

          {/*
          {isLoading && (
            <div className="justifyCenter">
              <Spinner />
            </div>
          )}
          */}
          
        </form>
      </div>
    </>
  )
}
