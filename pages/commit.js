import Head from 'next/head'
import { useState, useEffect } from 'react'
import useFetch from '../hooks/fetch'
import { ethers } from 'ethers'
import { Tag, Input, Heading, Tooltip, Button as ButtonThorin } from '@ensdomains/thorin'
import toast, { Toaster } from 'react-hot-toast'
import { useAccount, useNetwork, useProvider, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import Header from '../components/Header.js';
import { Placeholders } from "../components/Placeholders.js";
import Spinner from "../components/Spinner.js";
import { CONTRACT_ADDRESS, CONTRACT_OWNER, ABI } from '../contracts/CommitManager.ts';

export default function Commit() {

  useEffect(() => {
    getWalletMaticBalance()
    setTimeout(() => {
      setLoadingState("loaded");
    }, 1000);
  }, [])

  // state
  const [commitDescription, setCommitDescription] = useState('')
  const [commitTo, setCommitTo] = useState(CONTRACT_OWNER)
  const [commitAmount, setCommitAmount] = useState('0')
  const [validThrough, setValidThrough] = useState((24 * 3600 * 1000) + Date.now()) // 24 hours
  const [loadingState, setLoadingState] = useState('loading')
  const [hasCommitted, setHasCommited] = useState(false)
  const [walletMaticBalance, setWalletMaticBalance] = useState(null)

  // smart contract data
  const { chain, chains } = useNetwork()
  const { address } = useAccount()
  const provider = useProvider()

  // smart contract functions
  const { config: createCommitConfig } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    functionName: "createCommit",
    args: [commitDescription, commitTo, validThrough,
      { value: ((commitAmount == "") ? null : ethers.utils.parseEther(commitAmount)) }],
    onError: (err) => {
    }
  })
  const { write: commitWrite, data: commitWriteData, isLoading: isWriteLoading } = useContractWrite({
    ...createCommitConfig,
    onSettled(commitWriteData, error) {
      { wait }
    },
    onError: (err) => {
      const regex = /code=(.*?),/;
      const match = regex.exec(err.message);
      const code = match ? match[1] : null;
      if (code === "ACTION_REJECTED") {
        toast.error("Transaction Rejected")
      }
    }
  })
  const { wait, data: waitData, isLoading: isWaitLoading } = useWaitForTransaction({
    hash: commitWriteData?.hash,
    onSettled(waitData, error) {
      setHasCommited(true)
    },
  })

  // functions
  function formatUsd(number) {
    return number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })
  }

  async function getWalletMaticBalance() {
    try {
      const balanceMatic = await provider.getBalance(address)
      setWalletMaticBalance(parseFloat((Number(ethers.utils.formatEther(balanceMatic)))))
    } catch (err) {
      console.error("Error getting wallet balance:", err);
      return null;
    }
  }

  // polygon stats
  const priceApi = useFetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd')
  const maticPrice = parseFloat(priceApi.data?.["matic-network"].usd)

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

      <Header currentPage="commit" />

      <div className="container container--flex">
        <div className="heading">
          <Heading level="2" style={{ fontWeight: "400", letterSpacing: "0.014em" }}>
            Make a Commitment
          </Heading>
        </div>

        {
          loadingState === 'loading' && <Placeholders loadingStyle="indexLoadingStyle" number={1} />
        }

        {
          loadingState === 'loaded' &&

          <form
            id="form"
            className="form"

            // Toast Checks
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
              if (address.toUpperCase() == commitTo.toUpperCase()) {
                return toast.error('Cannot commit to self')
              }
              // is commitAmount not set?
              if (maticPrice * commitAmount == 0) {
                return toast.error('Set a commitment amount')
              }
            }}>

            <div className="flex flex-col gap-3 w-full">
              <Input
                label="Commitment"
                maxLength={140}
                placeholder=""
                disabled={!isWriteLoading && !isWaitLoading && hasCommitted}
                labelSecondary={
                  <Tag
                    className="hover:cursor-pointer"
                    tone="green"
                    size="large"
                    onClick={() => {
                      toast('📸 Can a pic or screenshot prove this?',
                        { position: 'top-center', id: 'unique' }
                      )
                    }}
                  >
                    <b>i</b>
                  </Tag>
                }
                error={(commitDescription.match(/^[a-zA-Z0-9\s\.,!?]*$/) ||
                  commitDescription.length == 0) ? null : "Alphanumeric only"}
                onChange={(e) => setCommitDescription(e.target.value)}
                required
              />
              <Input
                label="Amount"
                placeholder="5"
                disabled={!isWriteLoading && !isWaitLoading && hasCommitted}
                labelSecondary={
                  <Tag
                    className="hover:cursor-pointer"
                    tone="green"
                    size="large"
                    onClick={() => {
                      toast('1 MATIC 🟰 ' + formatUsd(maticPrice),
                        { position: 'top-center', id: 'unique' }
                      )
                    }}
                  >
                    <b>i</b>
                  </Tag>
                }
                min={0}
                step="any"
                max={9999}
                type="number"
                units="MATIC"
                error={
                  commitAmount > walletMaticBalance ? "Insufficient Funds":
                  commitAmount > 9999 ? "Up to 9999" : null
                }
                onChange={(e) => (
                  setCommitAmount(e.target.value)
                )}
                required
              />
              <Input
                label="Duration"
                placeholder="24"
                disabled={!isWriteLoading && !isWaitLoading && hasCommitted}
                min={1}
                max={24}
                step={1}
                type="number"
                units={((validThrough - Date.now()) / 3600 / 1000) > 1 ? 'hours' : 'hour'}
                error={((validThrough - Date.now()) / 3600 / 1000) > 24 ? "24 hour maximum" : null}
                labelSecondary={
                  <Tag
                    className="hover:cursor-pointer"
                    tone="green"
                    size="large"
                    onClick={() => {
                      toast("⏳ How many hours until you can prove it?",
                        { position: 'top-center', id: 'unique' }
                      )
                    }}
                  >
                    <b>i</b>
                  </Tag>
                }
                onChange={(e) => setValidThrough((e.target.value * 3600 * 1000) + Date.now())}
                required
              />
              <Input
                label="To"
                required
                readOnly
                placeholder="justcommit.eth"
                maxLength={42}
                onChange={(e) => setCommitTo(e.target.value)}
                onClick={() => {
                  toast('⚠️ Disabled (Beta)',
                    { position: 'top-center', id: 'unique' }
                  )
                }}
              />
            </div>

            {/* Commit Button */}
            {(!((isWriteLoading || isWaitLoading)) && !hasCommitted) && (
              <ButtonThorin style={{
                width: '60%',
                height: '2.8rem',
                margin: '1rem',
                backgroundColor:
                  commitAmount == 0 || commitAmount == "" ||
                  commitDescription.length < 2 ||
                  commitDescription.length > 35 ||
                  !commitDescription.match(/^[a-zA-Z0-9\s\.,!?]*$/) ||
                  ((validThrough - Date.now()) / 3600 / 1000) > 24 ||
                  commitAmount > 9999 ||
                  commitAmount > walletMaticBalance ?
                  "rgb(30 174 131 / 36%)" : "rgb(30 174 131)",
                borderRadius: 12,
                color: "white",
                transition: "transform 0.2s ease-in-out",
              }}
                size="small"
                shadowless
                type="submit"
                suffix={!priceApi.isLoading && "(" + formatUsd(maticPrice * commitAmount) + ")"}
                disabled={
                  commitAmount == 0 || commitAmount == "" ||
                  commitDescription.length < 2 ||
                  commitDescription.length > 35 ||
                  !commitDescription.match(/^[a-zA-Z0-9\s\.,!?]*$/) ||
                  ((validThrough - Date.now()) / 3600 / 1000) > 24 ||
                  commitAmount > 9999 ||
                  commitAmount > walletMaticBalance
                }
                onClick={commitWrite}
              >
                Commit
              </ButtonThorin>
            )}

            <Toaster toastOptions={{ duration: 2000 }} />

            {(((isWriteLoading || isWaitLoading)) && !hasCommitted) && (
              <div className="justifyCenter">
                <Spinner />
              </div>
            )}

            {hasCommitted &&
              <div className="flex flex-row mt-5 mb-2 gap-4">
                <ButtonThorin
                  style={{ padding: "12px", boxShadow: "0px 2px 2px 1px rgb(0 0 0 / 80%)", borderRadius: "10px" }}
                  outlined
                  shape="rounded"
                  tone="grey"
                  size="small"
                  variant="secondary"
                  as="a"
                  href={`https://${chain?.id === 80001 ? 'mumbai.' : ''
                    }polygonscan.com/tx/${commitWriteData.hash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Transaction
                </ButtonThorin>
                <div className="text-2xl font-bold">⚡</div>
                <ButtonThorin
                  style={{ padding: "12px", boxShadow: "0px 2px 2px 1px rgb(0 0 0 / 80%)", borderRadius: "10px" }}
                  outlined
                  shape="rounded"
                  tone="green"
                  size="small"
                  variant="primary"
                  as="a"
                  href="./"
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
            maticPrice * commitAmount: {typeof(maticPrice * commitAmount)}
            <br></br>
            <br></br>
            isWaitLoading: {String(isWaitLoading)}
            <br></br>
            <br></br>
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
