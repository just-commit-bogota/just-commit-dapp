import Head from 'next/head'
import useFetch from '../hooks/fetch'
import { useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'
import { Tag, Input, Heading, FieldSet, Select, Typography, RadioButton, RadioButtonGroup, Button as ButtonThorin } from '@ensdomains/thorin'
import toast, { Toaster } from 'react-hot-toast'
import 'react-tooltip/dist/react-tooltip.css'
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { useAccount, useNetwork, useProvider, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import Header from '../components/Header.js';
import Spinner from "../components/Spinner.js";
import { Placeholders } from "../components/Placeholders.js";
import { CONTRACT_ADDRESS, CONTRACT_OWNER, ABI } from '../contracts/CommitManager.ts';

export default function Home() {

  // first pass
  useEffect(() => {
    getWalletMaticBalance()
    setTimeout(() => {
      setLoadingState("loaded");
    }, 1000);
  }, [])

  // state
  const [commitDescription, setCommitDescription] = useState('')
  const [commitTo, setCommitTo] = useState("0xB44691c50339de6D882E1D6DB4EbE5E3d670BAAd") // hard-coded to JC address
  const [commitJudge, setCommitJudge] = useState([CONTRACT_OWNER])
  const [commitAmount, setCommitAmount] = useState('0')
  const [endsAt, setEndsAt] = useState((72 * 3600 * 1000) + Date.now())
  const [loadingState, setLoadingState] = useState('loading')
  const [hasCommitted, setHasCommited] = useState(false)
  const [walletMaticBalance, setWalletMaticBalance] = useState(null)
  const [betModality, setBetModality] = useState("solo")

  // smart contract data
  const { chain, chains } = useNetwork()
  const { address } = useAccount()
  const provider = useProvider()
  const selectRef = useRef();

  // smart contract functions
  const { config: createCommitConfig } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    functionName: "createCommit",
    args: [commitDescription, commitTo, commitJudge, endsAt, betModality == "solo",
      { value: ((commitAmount == "") ? null : ethers.utils.parseEther(commitAmount)) }],
  })
  const { write: commitWrite, data: commitWriteData, isLoading: isWriteLoading } = useContractWrite({
    ...createCommitConfig,
    onSettled() {
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
  const { wait, isLoading: isWaitLoading } = useWaitForTransaction({
    hash: commitWriteData?.hash,
    onSettled() {
      setHasCommited(true)
    },
  })

  // functions
  function formatCurrency(number, currency = null) {
    const options = {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    };

    if (currency) {
      options.style = 'currency';
      options.currency = currency;
    } else {
      options.style = 'decimal';
    }

    return number.toLocaleString('en-US', options);
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

  // effects
  useEffect(() => {
    getWalletMaticBalance()
  }, [address])

  useEffect(() => {
    if (betModality == "solo") {
      // set to the current value of the <Select> component
      if (selectRef.current) {
        setCommitTo(selectRef.current.value);
      }
      setCommitJudge([CONTRACT_OWNER]);
    } else if (betModality == "1v1") {
      setCommitJudge([commitTo]);
    }
  }, [betModality, commitTo]);

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

      <Header currentPage="home" />

      <div className="container container--flex h-screen items-stretch">
        <div className="mt-8" style={{ padding: "10px" }}>
          <FieldSet
            legend={
              <Heading color="textSecondary" style={{ fontWeight: '700', fontSize: '40px' }}>
                Bet On Yourself
              </Heading>
            }
          >
            {/* <RadioButtonGroup
              className="items-start place-self-center -mt-1 mb-3"
              onChange={(e) => setBetModality(e.target.value)}
            >
              <div className="flex gap-4">
                <RadioButton
                  checked={betModality == "solo"}
                  id="solo"
                  label="Solo"
                  name="solo"
                  value="solo"
                  onClick={(e) => setBetModality('solo')}
                />
                <RadioButton
                  checked={betModality == "1v1"}
                  id="1v1"
                  label="1v1"
                  name="1v1"
                  value="1v1"
                  onClick={(e) => {
                    setBetModality('1v1');
                    setCommitTo("");
                    setCommitJudge("");
                  }}
                />
              </div>
            </RadioButtonGroup> */}
          </FieldSet>
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
              // is commitAmount not set?
              if (maticPrice * commitAmount == 0) {
                return toast.error('Set a commitment amount')
              }
              // commiting to self?
              if (JSON.stringify(commitJudge).toUpperCase().includes(address.toUpperCase())) {
                return toast.error('Cannot verify yourself');
              }
            }}>

            <div className="flex flex-col gap-5 w-full">
              <Input
                label="Commitment"
                maxLength={27}
                placeholder=""
                disabled={!isWriteLoading && !isWaitLoading && hasCommitted}
                labelSecondary={
                  <a
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="📸&nbsp; Can a pic prove it?"
                    data-tooltip-place="right"
                  >
                    <Tag
                      style={{ background: '#1DD297' }}
                      size="large"
                    >
                      <b style={{ color: 'white' }}>?</b>
                    </Tag>
                  </a>
                }
                error={
                  commitDescription.match(/^[a-zA-Z0-9\s\.,!?<>]*$/) || commitDescription.length === 0
                    ? (commitDescription.length > 26 ? 'Say less.' : null)
                    : 'Alphanumeric only'
                }
                onChange={(e) => setCommitDescription(e.target.value)}
                required
              />
              {/* <WeekdaySelect endsAt={endsAt}/> */}
              <Input
                label="Expires In"
                placeholder="72"
                disabled={!isWriteLoading && !isWaitLoading && hasCommitted}
                min={1}
                max={168}
                maxLength={3}
                step={1}
                type="text"
                onKeyDown={(e) => {
                  if (
                    (!/^\d*\.?\d*$/.test(e.key) && e.key !== 'Backspace') ||
                    (e.target.value === '' && e.key === '0')
                  ) {
                    e.preventDefault();
                  }
                }}
                inputMode="numeric"
                units={((endsAt - Date.now()) / 3600 / 1000) > 1 ? 'hours' : 'hour'}
                error={((endsAt - Date.now()) / 3600 / 1000) > 168 ? "1 week maximum" : null}
                onChange={(e) => setEndsAt((e.target.value * 3600 * 1000) + Date.now())}
                labelSecondary={
                  <a
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="⏳ 1 week maximum"
                    data-tooltip-place="right"
                  >
                    <Tag
                      style={{ background: '#1DD297' }}
                      size="large"
                    >
                      <b style={{ color: 'white' }}>?</b>
                    </Tag>
                  </a>
                }
                required
              />

              <div className="flex flex-row items-baseline gap-2">
                <div className="w-full">
                  <Input
                    style={{ }}
                    label="Wager"
                    placeholder="5"
                    onKeyDown={(e) => {
                      if (!/^(?:(\d{1,3})|(\d{0,2}\.?\d{0,1})|(\d{1}\.\d{0,2}))$/.test(e.target.value + e.key) && e.key !== 'Backspace') {
                        e.preventDefault();
                      }
                    }}
                    disabled={!isWriteLoading && !isWaitLoading && hasCommitted}
                    /*
                    labelSecondary={
                      <a
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={"1 MATIC 🟰 " + formatCurrency(maticPrice, "USD")}
                        data-tooltip-place="right"
                      >
                        <Tag
                          style={{ background: '#1DD297' }}
                          tone="green"
                          size="large"
                        >
                          <b style={{ color: 'white' }}>?</b>
                        </Tag>
                      </a>
                    }
                    */
                    min={0}
                    step="any"
                    maxLength={3}
                    type="number"
                    error={
                      !address || !walletMaticBalance
                        ? null
                        : commitAmount > walletMaticBalance
                          ? " Available → " + formatCurrency(walletMaticBalance)
                          : commitAmount > 99
                            ? "Up to 99"
                            : null
                    }
                    onChange={(e) => {
                      setCommitAmount(e.target.value);
                    }}
                    required
                    prefix={
                      <div className="w-6 h-6">
                        <img className="w-full h-full -mr-1 lg:mr-0" src="./polygon-logo-tilted.svg" />
                      </div>
                    }
                    suffix=
                    {commitAmount != '0' && (
                      <div className="flex flex-col gap-2" style={{ fontSize: "small" }}>
                        <div className="flex gap-2" style={{ color: 'grey', whiteSpace: 'nowrap' }}>
                          {`(${formatCurrency(maticPrice * commitAmount, "USD")})`}
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
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
                    commitDescription.length > 26 ||
                    !commitDescription.match(/^[a-zA-Z0-9\s\.,!?<>]*$/) ||
                    ((endsAt - Date.now()) / 3600 / 1000) > 168 ||
                    commitAmount > 9999 ||
                    commitTo == "" ||
                    !/^0x[a-fA-F0-9]{40}$/.test(commitTo) ||
                    commitAmount > walletMaticBalance ?
                    "rgb(29 210 151 / 36%)" : "rgb(29 210 151)",
                borderRadius: 12,
                color: "white",
                transition: "transform 0.2s ease-in-out",
              }}
                size="small"
                shadowless
                type="submit"
                suffix={!priceApi.isLoading && "(" + formatCurrency(maticPrice * commitAmount, "USD") + ")"}
                disabled={
                  commitAmount == 0 || commitAmount == "" ||
                  commitDescription.length < 2 ||
                  commitDescription.length > 26 ||
                  !commitDescription.match(/^[a-zA-Z0-9\s\.,!?<>]*$/) ||
                  ((endsAt - Date.now()) / 3600 / 1000) > 168 ||
                  commitAmount > 9999 ||
                  commitAmount > walletMaticBalance ||
                  commitTo == "" ||
                  !/^0x[a-fA-F0-9]{40}$/.test(commitTo)
                }
                onClick={commitWrite}
              >
                Commit
              </ButtonThorin>
            )}

            <Toaster toastOptions={{ duration: 2000 }} />
            <Tooltip id="my-tooltip"
              style={{ backgroundColor: "#1DD297", color: "#ffffff", fontWeight: 500 }}
            />

            {(((isWriteLoading || isWaitLoading)) && !hasCommitted) && (
              <div className="justifyCenter">
                <Spinner />
              </div>
            )}

            {hasCommitted &&
              <div className="w-full relative">
                <div className="absolute w-full p-1" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <div className="flex justify-center w-3/10">
                    <ButtonThorin
                      className="flex"
                      style={{ padding: "20px", backgroundColor: "#1DD297", boxShadow: "0px 2px 2px 1px rgb(0 0 0 / 80%)", borderRadius: "10px" }}
                      outlined
                      shape="rounded"
                      size="small"
                      variant="primary"
                      as="a"
                      href="./"
                      onClick={() => {
                        localStorage.setItem("selectedFilter", "Active");
                      }}
                    >
                      Commitment
                    </ButtonThorin>
                  </div>
                </div>
                <div className="flex justify-end w-full">
                  <div className="flex" style={{ width: "52px" }}>
                    <ButtonThorin
                      className="flex align-center mt-2 mb-5 sm:mb-0 justify-center rounded-lg hover:cursor-pointer"
                      style={{ background: "#bae6fd", zIndex: 2, fontSize: "1.2rem", padding: "5px" }}
                      as="a"
                      href={`https://${chain?.id === 80001 ? 'mumbai.' : ''
                        }polygonscan.com/tx/${commitWriteData.hash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      🔎
                    </ButtonThorin>
                  </div>
                </div>
              </div>
            }

            {/*
            ---------
            DEBUGGING
            ---------
            */}

            {/*endsAt: {endsAt}
            <br></br>
            block.timestamp * 1000: {Math.floor(Date.now() / 1000) * 1000}
            <br></br>*/}

            {/* commitJudge: {commitJudge}
            <br></br>
            commitTo: {commitTo} */}

            {/* endsAt: {endsAt} */}

            {/* <br></br>
            <br></br>
            maticPrice * commitAmount: {typeof(maticPrice * commitAmount)}
            <br></br>
            <br></br>
            isWaitLoading: {String(isWaitLoading)}
            <br></br>
            <br></br>
            endsAt: {endsAt}
            <br></br>
            <br></br>
            Date.now(): {Date.now()} */}

          </form>
        }
      </div>
    </>
  )
}