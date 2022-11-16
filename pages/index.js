import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom';
import abi from "../contracts/CommitManager.json"
import { ethers } from 'ethers'
import { Tag, Input } from '@ensdomains/thorin'
import Button from '@mui/material/Button'
import toast, { Toaster } from 'react-hot-toast'
import { useAccount, useNetwork, useProvider } from 'wagmi'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { useWaitForTransaction } from 'wagmi'
import dayjs from "dayjs";
import Header from '../components/Header.js';
import { Placeholders } from "../components/Placeholders.js";
import CommitModal from "../components/CommitModal.js";
import Spinner from "../components/Spinner.js";

export default function Home() {

  useEffect(() => {
    setTimeout(() => {
      setLoadingState('loaded')
    }, 1000);
  }, []);

  // state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [commitDescription, setCommitDescription] = useState('')
  const [commitTo, setCommitTo] = useState('0xB44691c50339de6D882E1D6DB4EbE5E3d670BAAd') // hard-coded for now (belf.eth)
  const [commitAmount, setCommitAmount] = useState('0.05')
  const [validThrough, setValidThrough] = useState(1)
  const [loadingState, setLoadingState] = useState('loading')
  const [transactionLoading, setTransactionLoading] = useState(false)
  
  // smart contract
  const provider = useProvider()
  const { chain, chains } = useNetwork()
  const { address: isConnected } = useAccount()
  const contractAddress = "0x33CaC3508c9e3C50F1ae08247C79a8Ed64ad82a3"
  
  const { config } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: abi.abi,
    functionName: "createCommit",
    args: [commitDescription, commitTo, validThrough,
          { value: ((commitAmount == "") ? null : ethers.utils.parseEther(commitAmount)) }]
  })
  const { data, write, isLoading } = useContractWrite({
    ...config,
    onSettled(data, error) {
      setTransactionLoading(true)
      waitForTransaction()
    },
  })
  const waitForTransaction = useWaitForTransaction({
    hash: data?.hash,
    onSettled(data, error) {
      setTransactionLoading(false)
    },
  })
  
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
      
      <Header />

      <div className="container container--flex">
        <div className="heading text-3xl font-bold">
          Make a Commitment
        </div>

        {
          loadingState === 'loading' && <Placeholders loadingStyle = "indexLoadingStyle" number = {1} />
        }

        {
          loadingState === 'loaded' &&
        
          <form
            id="form"
            className="form"
            
            // write();
            // toast.error('Coming soon! Working on it... ', { position: 'bottom-center' })}} 
            // setModalOpen(true)

            // this takes priority over Commit <Button> onClick
            onSubmit={async (e) => {
              e.preventDefault()

              // Toast Checks
              
              // 1. On right network
              if (!chains.some((c) => c.id === chain.id)) {
                return toast.error('Switch to a supported network')
              }

              // 2. blah
            }}>
  
            <div className="flex flex-col gap-3 w-full">
              <Input
                label="Commitment"
                maxLength={140}
                placeholder=""
                labelSecondary={
                  <Tag
                    className="hover:cursor-pointer"
                    tone="green"
                    size="small"
                    onClick={() =>
                      {toast('📸 Can a pic or screenshot prove this?'),
                      { position: 'top-center' }}}
                  >
                    i
                  </Tag>
                }
                error={(commitDescription.match(/^[a-zA-Z0-9\s\.,!?]*$/) ||
                        commitDescription.length == 0) ? null : "Alphanumeric only"}
                onChange={(e) => setCommitDescription(e.target.value)}
                required
              />
              <Input
                label="To"
                maxLength={42}
                value="justcommit.eth"
                //parentStyles = {{ backgroundColor: '#f1fcf8' }}
                onChange={(e) => setCommitTo(e.target.value)}
                required
                disabled
              />
              <Input
                label="Amount"
                placeholder="0.05"
                // min={1}
                step={1}
                max={9999}
                type="number"
                units="Goerli ETH"
                error={(commitAmount) > 9999 ? "Maximum of $9999" : null}
                //parentStyles = {{ backgroundColor: '#f1fcf8' }}
                onChange={(e) => setCommitAmount(e.target.value)}
                required
              />
              {/* TODO: abstract away the UNIX conversion*/}
              <Input
                label="Duration"
                placeholder="1"
                min={1}
                max={24}
                step={1}
                type="number"
                units={((validThrough - dayjs()) / 3600) > 1 ? 'hours' : 'hour'}
                error={((validThrough - dayjs()) / 3600) > 24 ? "24 hour maximum" : null}
                //parentStyles={{ backgroundColor: '#f1fcf8' }}
                onChange={(e) => setValidThrough(Math.round(e.target.value * 3600 + Date.now()/1000))}
                required
              />
            </div>
  
            {/* the Commit button */}
            {(!isLoading && !transactionLoading) && (
              <Button style={{
                width: '32%',
                margin: '1rem',
                backgroundColor:
                  commitDescription.length < 6 ||
                  commitDescription.length > 35 ||
                  !commitDescription.match(/^[a-zA-Z0-9\s\.,!?]*$/) ||
                  ((validThrough - dayjs()) / 3600 > 24) ||
                  (commitAmount > 9999) ?
                  "rgb(73 179 147 / 35%)": "rgb(73 179 147)",
                borderRadius: 12,
                color: "white",
                boxShadow: "0rem 0.4rem 0.4rem 0rem lightGrey",
              }}
                tone="green"
                type="submit"
                variant="action"
                disabled = {
                  commitDescription.length < 6 ||
                  commitDescription.length > 35 ||
                  !commitDescription.match(/^[a-zA-Z0-9\s\.,!?]*$/) ||
                  ((validThrough - dayjs()) / 3600 > 24) ||
                  (commitAmount > 9999)
                }
                onClick= {write}
              >
                Commit
              </Button>
            )}

            {/*
            {(modalOpen && 
            <CommitModal
              commitDescription = {commitDescription}
              commitTo = "justcommit.eth" // {commitTo}
              amount = {commitAmount}
              duration = {validThrough}
              modalOpen = {modalOpen}
              setModalOpen = {setModalOpen}
            />
            )}
            */}
            
            <Toaster toastOptions={{duration: '200'}}/>
  
            {(isLoading || transactionLoading) && (
              <div className="justifyCenter">
                <Spinner />
              </div>
            )}
  
          </form>
        }
      </div>
    </>
  )
}
