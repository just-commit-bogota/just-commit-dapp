import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import abi from "../contracts/CommitManager.json";
import { ethers } from 'ethers'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import { ConnectButton } from '@rainbow-me/rainbowkit'
import toast, { Toaster } from 'react-hot-toast'
import Spinner from "../components/Spinner";
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

      <div className="header header--absolute bg-white">
        <a href="./">
          <img src="./logo.png"/>
        </a>
        <div>
          <ConnectButton className="mr-2 md:inline-flex hover:shadow-lg flex" />
        </div>
      </div>

      <div className="container container--flex container--one">
        <div className="heading text-3xl text-left">
          Make a Commitment
        </div>
        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault()
            // do Toast checks 
            setDialogOpen(true)
          }}      
        >
          <div className="col">
            <TextField
              id="outlined-helperText"
              placeholder="focused building"
              helperText="Description"
              onChange={(e) => setCommitDescription(e.target.value)}
            />
            <TextField
              id="outlined-helperText"
              placeholder="0xb44...aad"
              helperText="Commit To"
              onChange={(e) => setCommitTo(e.target.value)}
            />
            <TextField
              id="outlined-helperText"
              placeholder="0.001"
              helperText="Commit Amount"
              onChange={(e) => setCommitAmount(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">ETH</InputAdornment>,
              }}
            />
            <TextField
              id="outlined-helperText"
              placeholder="4"
              helperText="Valid Through"
              onChange={(e) => setValidThrough(e.target.value * 3600 + dayjs())}
              InputProps={{
                endAdornment: <InputAdornment position="end">Hour(s)</InputAdornment>,
              }}
            />
          </div>
          
          {/* the Commit button */}
          {!isLoading && (
            <Button style ={{
              width: '18%',
              margin: '1rem',
              backgroundColor: "#1DD297",
              borderRadius: 8,
            }}
            variant="contained"
            onClick={()=> {
              console.log(validThrough)}}
            >
            Commit
          </Button>
          )}

          {/*|| (transactionStatus == "loading")*/}
          {isLoading && (
            <div className="justifyCenter">
              <Spinner />
            </div>
          )}
          
        </form>
      </div>

      {/*
      <div className="container container--flex">
        <div className="heading heading--two">
          My Commitments     
        </div>
      </div>
      */}
    </>
  )
}

{/*
(TODO: update to include the @media overrides)
(TODO: figure out how to do tailwindCSS for below header CSS code)
(TODO: add "Home" and "Feed" tabs)
*/}