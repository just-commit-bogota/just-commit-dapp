import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import abi from "../contracts/CommitManager.json"
import { ethers } from 'ethers'
import { Tag, Typography, Input, Dialog } from '@ensdomains/thorin'
import Button from '@mui/material/Button'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import toast, { Toaster } from 'react-hot-toast'
import { useAccount, useNetwork, useProvider } from 'wagmi'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { useWaitForTransaction } from 'wagmi'
import dayjs from "dayjs";

export default function Home() {

  // state variables
  const [dialogOpen, setDialogOpen] = useState(false);
  const [commitDescription, setCommitDescription] = useState('')
  const [commitTo, setCommitTo] = useState('')
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
    args: [commitDescription, commitTo, validThrough, { value: ethers.utils.parseEther(commitAmount) }]
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
            <img src="./logo.png" />
          </a>
          {/*
          <Dropdown
            className="hidden sm:inline"
            inner
            items={[
              { label: 'Active', onClick: () => null, color: 'text' },
              { label: 'Past', onClick: () => null, color: 'text' },
            ]}
            label="Commitments"
          />
          */}
        </div>
        <div className="flex space-x-0 sm:space-x-10 items-center gap-10 sm:gap-0">
          <a
            className="font-medium p-1 truncate underline underline-offset-4 decoration-[#1DD297] decoration-1
                       hover:decoration-8 hover:scale-105"
            href="https://danielbelfort.notion.site/Just-Commit-9213dcd452184278a4f628b0e3f48e78"
            target="_blank">
            About
          </a>
          <ConnectButton className="mr-10 hover:shadow-lg" />
        </div>
      </div>

      <div id="notHeader" className="container container--flex">
        <div className="heading text-3xl font-bold">
          Make a Commitment
        </div>

        <form
          id="form"
          className="form"
          onSubmit={async (e) => {
            e.preventDefault()
            // Toast checks

          }}>

          <div className="col">
            <Input
              label="Commitment"
              maxLength={140}
              placeholder="Strength workout"
              labelSecondary={
                <Tag
                  className="hover:cursor-pointer"
                  tone="green"
                  size="small"
                  onClick={() => setDialogOpen(true)}>
                  i
                </Tag>
              }
              onChange={(e) => setCommitDescription(e.target.value)}
              required
            />
            <Input
              label="To"
              maxLength={42}
              value="justcommit.eth"
              labelSecondary={
                <Tag
                  className="hover:cursor-pointer"
                  tone="green"
                  size="small"
                  onClick={() => setDialogOpen(true)}>
                  i
                </Tag>
              }
              //parentStyles = {{ backgroundColor: '#f1fcf8' }}
              onChange={(e) => setCommitTo(e.target.value)}
              required
              disabled
            />
            <Input
              label="Amount"
              placeholder="10"
              step="10"
              min={0}
              max={100}
              type="number"
              units="USDC"
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
              max={12}
              //parentStyles={{ backgroundColor: '#f1fcf8' }}
              onChange={(e) => setValidThrough(e.target.value * 3600 + dayjs())}
              required
            />
          </div>

          {/* the Commit button */}
          {!isLoading && (
            <Button style={{
              width: '32%',
              margin: '1rem',
              backgroundColor: "#40b08b",
              borderRadius: 12,
              color: "white",
              boxShadow: "0rem 0.4rem 0.4rem 0rem lightGrey",
            }}
              tone="green"
              variant="primary"
              onClick={() => { toast.error('Coming soon! Working on it... ') }}// write();
            >
              Commit
            </Button>
          )}

          <Toaster position="bottom-center" />
          
          {dialogOpen && ( 
            <div>
              <Dialog
                style={{
                  "opacity": "100%",
                  "display": "block",
                  "height": "70%",
                }}
                open={dialogOpen}
                variant="closable"
                onDismiss={() => setDialogOpen(false)}
              >
                Hi
              </Dialog>
            </div>
          )}

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
