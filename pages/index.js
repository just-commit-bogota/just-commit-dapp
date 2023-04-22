import Head from 'next/head'
import useFetch from '../hooks/fetch'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Tag, Heading, FieldSet, Typography, Checkbox, Button as ButtonThorin } from '@ensdomains/thorin'
import toast, { Toaster } from 'react-hot-toast'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip';
import { useAccount, useNetwork, useProvider, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import Header from '../components/Header.js';
import Spinner from "../components/Spinner.js";
import { Placeholders } from "../components/Placeholders.js";
import { CONTRACT_ADDRESS, CONTRACT_OWNER, ABI } from '../contracts/CommitManager.ts';
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { PopupButton } from '@typeform/embed-react'

export default function Commit() {

  // first pass
  useEffect(() => {
    getWalletMaticBalance()
    setTimeout(() => {
      setLoadingState("loaded");
    }, 1000);
  }, [])

  // challenge cost
  const CHALLENGE_COST = '10'
  const commitTo = CONTRACT_OWNER
  const commitJudge = CONTRACT_OWNER
  
  // state
  const [commitAmount, setCommitAmount] = useState(CHALLENGE_COST) // TODO refactor this
  const [loadingState, setLoadingState] = useState('loading')
  const [hasCommitted, setHasCommited] = useState(false)
  const [walletMaticBalance, setWalletMaticBalance] = useState(null)
  const [showLoomEmbed, setShowLoomEmbed] = useState(false);
  const [videoWatched, setVideoWatched] = useState([false, false, false]);
  const [loomEmbedUrl, setLoomEmbedUrl] = useState(null);

  // smart contract data
  const { chain, chains } = useNetwork()
  const { address } = useAccount()
  const provider = useProvider()

  // smart contract functions
  const { config: createCommitConfig } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    functionName: "createCommit",
    args: [commitTo, commitJudge, "100", // TODO: this should be phonePickups
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

  const isCommitButtonEnabled = () => {
    return videoWatched.every(v => v) &&
           Boolean(address) && 
           walletMaticBalance > parseFloat(CHALLENGE_COST);
  };

  // functions
  function formatCurrency(number, currency = null) {
    const options = {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
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

  // commit logic related
  const closeModal = () => {
    setShowLoomEmbed(false);
  };
  const handleWatchVideoClick = (index, videoLink) => {
    setShowLoomEmbed(!showLoomEmbed);
    setLoomEmbedUrl(videoLink);
  
    const newVideoWatched = [...videoWatched];
    newVideoWatched[index] = true;
    setVideoWatched(newVideoWatched);
  };
  const handleCheckboxClick = (index) => {
    if (!videoWatched[index]) {
      toast.error("Watch the video")
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  // polygon stats
  const priceApi = useFetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd')
  const maticPrice = parseFloat(priceApi.data?.["matic-network"].usd)

  // effects
  useEffect(() => {
    getWalletMaticBalance()
  }, [address])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

      <Header currentPage="index" />

      <div className="container container--flex h-screen items-stretch">
        <div className="mt-6 mb-0" style={{ padding: "10px" }}>
          <FieldSet
            legend={
              <div className="text-center justify-center align-center">
                <Heading className="mb-4" color="textSecondary" style={{ fontWeight: '700', fontSize: '40px' }}>
                  Welcome.
                </Heading>
                <Typography className="-mb-6" variant="label" weight="medium" style={{ lineHeight: '1.4em', fontSize: '0.6em' }}>
                  Bet on yourself for 4 weeks →
                  <br />
                  Reduce your phone pickups by ~70% →
                  <br />
                  <Typography style={{ lineHeight: '2.9em' }}>Feel more <b>ALIVE</b></Typography>
                </Typography>
              </div>
            }
          >
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
            }}>

            <div className="flex flex-col w-full gap-6 mt-0" style={{direction:"rtl"}}>

              <Checkbox
                label={
                  <span
                    className="permanent-underline hover:scale-105"
                    onClick={() => handleWatchVideoClick(0, 'https://1.com')}
                  >
                    ?What is Just Commit
                  </span>
                }
                checked={videoWatched[0]}
                onClick={() => handleCheckboxClick(0)}
              />
              <Checkbox
                label={
                  <span
                    className="permanent-underline hover:scale-105"
                    onClick={() => handleWatchVideoClick(1, 'https://2.com')}
                  >
                    ?Why am I here
                  </span>
                }
                checked={videoWatched[1]}
                onClick={() => handleCheckboxClick(1)}
              />
              <Checkbox
                label={
                  <span
                    className="permanent-underline hover:scale-105"
                    onClick={() => handleWatchVideoClick(2, 'https://3.com')}
                  >
                    ?How does this work
                  </span>
                }
                checked={videoWatched[2]}
                onClick={() => handleCheckboxClick(2)}
              />
              
              {showLoomEmbed && (
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 1000,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onClick={closeModal}
                >
                  <div
                    style={{
                      width: '90%',
                      height: '90%',
                      backgroundColor: 'white',
                      position: 'relative',
                      borderRadius: '10px',
                    }}
                  >
                    <iframe
                      src={loomEmbedUrl}
                      frameBorder="0"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        borderRadius: '10px',
                      }}
                    ></iframe>
                  </div>
                </div>
              )}
              {/* <Checkbox
                label={
                  <PopupButton
                    id="IfnJtCQO"
                    onSubmit={() => {
                      setTypeformCompleted(true);
                    }}
                  >
                    <button className="permanent-underline">
                      Fill Out The Form
                    </button>
                  </PopupButton>
                }
                checked={typeformCompleted}
                onClick={() => toast.error("Complete the Typeform")}
              /> */}

              <Checkbox
                label={
                  <div className="flex justify-center" style={{direction:"ltr"}}>
                    <ConnectButton className="" showBalance={true} accountStatus="none" />
                  </div>
                }
                checked={Boolean(address)}
                onClick={() => toast.error("Connect your wallet")}
              />
               
            </div>

            {/* Commit Button */}
            {(!((isWriteLoading || isWaitLoading)) && !hasCommitted) && (
              <ButtonThorin
                style={{
                  width: '80%',
                  height: '2.8rem',
                  marginTop: '2rem',
                  marginBottom: '0rem',
                  backgroundColor: isCommitButtonEnabled() ? "rgb(29 210 151)" : "rgb(29 210 151 / 36%)",
                  borderRadius: 12,
                  color: "white",
                  transition: "transform 0.2s ease-in-out",
                }}
                size="small"
                shadowless
                type="submit"
                suffix={"(" + commitAmount + " MATIC)"}
                // suffix= {"(" + formatCurrency(100, "USD") + ")"} // {!priceApi.isLoading && "(" + formatCurrency(maticPrice * commitAmount, "USD") + ")"}
                disabled={!isCommitButtonEnabled()}
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

            {/*
            <br></br>
            block.timestamp * 1000: {Math.floor(Date.now() / 1000) * 1000}
            <br></br>*/}

            {/* commitAmount: {commitAmount}
            <br></br>
            commitJudge: {commitJudge}
            <br></br>
            commitTo: {commitTo} */}
            
            {/* <br></br>
            <br></br>
            maticPrice * commitAmount: {typeof(maticPrice * commitAmount)}
            <br></br>
            <br></br>
            isWaitLoading: {String(isWaitLoading)}
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            Date.now(): {Date.now()} */}

          </form>
        }
      </div>
    </>
  )
}
