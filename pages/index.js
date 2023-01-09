import Head from 'next/head'
import { useState, useEffect } from 'react'
import useFetch from '../hooks/fetch'
import abi from "../contracts/CommitManager.json"
import { ethers } from 'ethers'
import { Tag, Input, Button as ButtonThorin } from '@ensdomains/thorin'
import Button from '@mui/material/Button'
import toast, { Toaster } from 'react-hot-toast'
import { useAccount, useNetwork, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import Header from '../components/Header.js';
import { Placeholders } from "../components/Placeholders.js";
import Spinner from "../components/Spinner.js";
import { useStorage } from '../hooks/useLocalStorage.ts';

export default function Home() {

  useEffect(() => {
    setLoadingState('loaded')
  }, []);

  // hard-coded
  const CONTRACT_ADDRESS = "0xa8db83b92e56bac174e71283104176d4368092d9"
  const CONTRACT_OWNER = "0xb44691c50339de6d882e1d6db4ebe5e3d670baad"

  // variables
  const { setItem } = useStorage()

  // state
  const [commitDescription, setCommitDescription] = useState('')
  const [commitTo, setCommitTo] = useState(CONTRACT_OWNER)
  const [commitAmount, setCommitAmount] = useState('0.01')
  const [validThrough, setValidThrough] = useState((1 * 3600 * 1000) + Date.now()) // == 1 hour
  const [loadingState, setLoadingState] = useState('loading')
  const [hasCommited, setHasCommited] = useState(false)

  // smart contract data
  const { chain, chains } = useNetwork()
  const { address } = useAccount()

  // contract functions
  const { config } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abi.abi,
    functionName: "createCommit",
    args: [commitDescription, commitTo, validThrough,
      { value: ((commitAmount == "") ? null : ethers.utils.parseEther(commitAmount)) }]
  })
  const { write, data, isLoading: isWriteLoading } = useContractWrite({
    ...config,
    onSettled(data, error) {
      { wait }
      setItem('txnHash', data?.hash)
    },
  })
  const { wait, isLoading: isWaitLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSettled(data, error) {
      setHasCommited(true)
    },
  })

  // extra (live ETH stats)
  const gasApi = useFetch('https://gas.best/stats')
  const gasPrice = gasApi.data?.pending?.fee
  const ethPrice = gasApi.data?.ethPrice

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

      <Header />

      <div className="container container--flex">
        <div className="heading text-3xl font-bold">
          Make a Commitment
        </div>

        {
          loadingState === 'loading' && <Placeholders loadingStyle="indexLoadingStyle" number={1} />
        }

        {
          loadingState === 'loaded' &&

          <form
            id="form"
            className="form"

            // Toast Checks (which have priority over the Commit Button onClick)
            onSubmit={async (e) => {
              e.preventDefault()
              // is wallet connected?
              if (!address) {
                return toast.error('Connect your wallet')
              }
              // are you on the right network?
              if (!chains.some((c) => c.id === chain.id)) {
                return toast.error('Switch to a supported network')
              }
              // commiting to self?
              if (commitTo == address) {
                return toast.error('Cannot commit to self')
              }
            }}>

            <div className="flex flex-col gap-3 w-full">
              <Input
                label="Commitment"
                maxLength={140}
                placeholder=""
                disabled={!isWriteLoading && !isWaitLoading && hasCommited}
                labelSecondary={
                  <Tag
                    className="hover:cursor-pointer"
                    tone="green"
                    size="small"
                    onClick={() => {
                      toast('📸 Can a pic or screenshot prove this?'),
                        { position: 'top-center' }
                    }}
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
                placeholder="justcommit.eth"
                maxLength={42}
                onChange={(e) => setCommitTo(e.target.value)}
                labelSecondary={
                  <Tag
                    className="hover:cursor-pointer"
                    tone="green"
                    size="small"
                    onClick={() => {
                      toast('⚠️ Only address allowed in Beta'),
                        { position: 'top-center' }
                    }}
                  >
                    i
                  </Tag>
                }
                required
                disabled
              />
              <Input
                label="Amount"
                placeholder="1"
                disabled={!isWriteLoading && !isWaitLoading && hasCommited}
                min={0}
                step="any"
                max={9999}
                type="number"
                units="Goerli ETH"
                error={(commitAmount) > 9999 ? "Maximum of $9999" : null}
                onChange={(e) => setCommitAmount(e.target.value)}
                required
              />
              <Input
                label="Duration"
                placeholder="1"
                disabled={!isWriteLoading && !isWaitLoading && hasCommited}
                min={1}
                max={24}
                step={1}
                type="number"
                units={((validThrough - Date.now()) / 3600 / 1000) > 1 ? 'hours' : 'hour'}
                error={((validThrough - Date.now()) / 3600 / 1000) > 24 ? "24 hour maximum" : null}
                onChange={(e) => setValidThrough((e.target.value * 3600 * 1000) + Date.now())}
                required
              />
            </div>

            {/* Commit Button */}
            {(!((isWriteLoading || isWaitLoading)) && !hasCommited) && (
              <Button style={{
                width: '32%',
                margin: '1rem',
                backgroundColor:
                  commitDescription.length < 6 ||
                    commitDescription.length > 35 ||
                    !commitDescription.match(/^[a-zA-Z0-9\s\.,!?]*$/) ||
                    ((validThrough - Date.now()) / 3600 / 1000) > 24 ||
                    (commitAmount > 9999) ?
                    "rgb(73 179 147 / 35%)" : "rgb(73 179 147)",
                borderRadius: 12,
                color: "white",
                boxShadow: "0rem 0.4rem 0.4rem 0rem lightGrey",
              }}
                tone="green"
                type="submit"
                variant="action"
                disabled={
                  commitDescription.length < 6 ||
                  commitDescription.length > 35 ||
                  !commitDescription.match(/^[a-zA-Z0-9\s\.,!?]*$/) ||
                  ((validThrough - Date.now()) / 3600 / 1000) > 24 ||
                  (commitAmount > 9999)
                }
                onClick={write}
              >
                Commit
              </Button>
            )}

            <Toaster toastOptions={{ duration: 2000 }} />

            {(((isWriteLoading || isWaitLoading)) && !hasCommited) && (
              <div className="justifyCenter">
                <Spinner />
              </div>
            )}

            {hasCommited &&
              <div className="flex flex-row mt-5 mb-2 gap-4">
                <ButtonThorin
                  outlined
                  shape="rounded"
                  tone="grey"
                  size="small"
                  variant="transparent"
                  as="a"
                  href={`https://${chain?.id === 5 ? 'goerli.' : ''
                    }etherscan.io/tx/${data.hash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Transaction
                </ButtonThorin>
                <div className="text-2xl font-bold">⚡</div>
                <ButtonThorin
                  outlined
                  shape="rounded"
                  tone="green"
                  size="small"
                  variant="secondary"
                  as="a"
                  href="./commitments"
                >
                  Commitment
                </ButtonThorin>
              </div>
            }

            {/*
            ---------
            DEBUGGING
            ---------
            */}

            {/*
            isWriteLoading: {String(isWriteLoading)}
            <br></br>
            <br></br>
            isWaitLoading: {String(isWaitLoading)}
            <br></br>
            <br></br>
            hasCommited: {String(hasCommited)}
            */}

            {/*
            validThrou.: {validThrough}
            <br></br>
            <br></br>
            Date.now(): {Date.now()}
            */}

          </form>
        }
      </div>
    </>
  )
}
