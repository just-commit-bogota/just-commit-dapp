import { useState, useEffect } from 'react'
import Head from 'next/head'
import useFetch from '../hooks/fetch'
import { ethers } from 'ethers'
import { Tag, Heading, FieldSet, Card, Typography, Input, Button as ButtonThorin } from '@ensdomains/thorin'
import toast, { Toaster } from 'react-hot-toast'
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip';
import { useAccount, useNetwork, useProvider, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import Header from '../components/Header.js';
import Spinner from "../components/Spinner.js";
import SocialTags from "../components/SocialTags.js";
import LoomModal from "../components/LoomModal.js";
import { CONTRACT_ADDRESS, CONTRACT_OWNER, ABI } from '../contracts/CommitManager.ts';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { sendAnEmail } from "../utils/emailService";

export default function Commit() {

  // first pass
  useEffect(() => {
    getWalletMaticBalance()
    setTimeout(() => {
      setLoadingState("loaded");
    }, 1000);
  }, [])

  // variables
  const CHALLENGE_COST = '100'
  const commitTo = CONTRACT_OWNER
  const commitJudge = CONTRACT_OWNER
  const socialTagNames = ["insta", "tiktok", "twitter", "youtube", "snap"];
  const betAmountOptions = ["$10", "$100", "$1000"];

  // state
  const [commitAmount, setCommitAmount] = useState(CHALLENGE_COST) // TODO refactor this
  const [loadingState, setLoadingState] = useState('loading')
  const [hasCommitted, setHasCommited] = useState(false)
  const [walletMaticBalance, setWalletMaticBalance] = useState(null)
  const [showVideoEmbed, setShowVideoEmbed] = useState(false);
  const [videoWatched, setVideoWatched] = useState([false, false, false]);
  const [videoEmbedUrl, setVideoEmbedUrl] = useState(null);
  const [showText, setShowText] = useState(false);
  const [userEmail, setUserEmail] = useState("null@null.com");
  const [screenTime, setScreenTime] = useState(null);
  const [pickupGoal, setPickupGoal] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedBetAmount, setSelectedBetAmount] = useState(null);

  // smart contract data
  const { chain } = useNetwork()
  const { address } = useAccount()
  const provider = useProvider()

  // smart contract functions
  const { config: createCommitConfig } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    functionName: "createCommit",
    args: [commitTo, commitJudge, screenTime, { value: ((commitAmount == "") ? null : ethers.utils.parseEther(commitAmount)) }],
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
    async onSettled() {
      setHasCommited(true)
      await handleSaveCommitment(userEmail, chain);
      // send an email only on Polygon Mainnet
      if (chain?.id == 137) {
        sendAnEmail(userEmail);
      }
    },
  })

  // functions
  const handleSaveCommitment = async (email, chain) => {
    if (chain?.id !== 137 && chain?.id !== 80001) {
      console.log('Not on Polygon, skipping Supabase write.');
      return;
    }
  
    const environment = chain?.id === 137 ? 'prod' : 'dev';
  
    try {
      const response = await fetch('/api/save_commitment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, address: address, environment: environment }),
      });
  
      if (!response.ok) {
        console.error('Failed to store commitment in Supabase');
      } else {
        console.log('Commitment saved successfully');
      }
    } catch (error) {
      console.error('Failed to store commitment in Supabase');
    }
  };

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
  
  function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function stripDollarSign(string) {
    if (!string) return "";
    return string.replace(/\$/g, '');
  }

  // commit logic related
  const closeModal = () => {
    setShowVideoEmbed(false);
  };
  const videoLinks = [
    'https://www.youtube.com/embed/_XTX4aZFEZQ',
    'https://www.youtube.com/embed/F4qlKB6_tRk',
    'https://www.youtube.com/embed/F4qlKB6_tRk',
  ];
  const handleWatchVideoClick = (index) => {
    const videoLink = videoLinks[index];

    setShowVideoEmbed(!showVideoEmbed);
    setVideoEmbedUrl(videoLink);

    const newVideoWatched = [...videoWatched];
    newVideoWatched[index] = true;
    setVideoWatched(newVideoWatched);
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  // eth stats
  const priceApi = useFetch('https://gas.best/stats')
  const ethPrice = parseFloat(priceApi.data?.ethPrice)
  // polygon stats
  // const priceApi = useFetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd')
  // const maticPrice = parseFloat(priceApi.data?.["matic-network"].usd)

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
        <link rel="icon" type="image/png" sizes="16x16" href="./favicon.ico" />
      </Head>

      <Header currentPage="index" />
      
      <div className="container container--flex items-stretch">
        <div className="mt-4 mb-0" style={{ padding: "10px" }}>
          <FieldSet
            legend={
              <div className="flex flex-col text-center justify-center align-center">

                <Card className="flex flex-col self-center justify-center bg-white shadow-lg rounded-lg p-6 md:w-3/6" style={{ alignItens: ''}}>
                  <Typography className="font-semibold md:font-normal text-xs md:text-lg" style={{ lineHeight: '1.5em', fontWeight: '' }}>
                    Just Commit is a 1-month challenge designed to
                    help you soothe the addiction you have
                    with that leisure app on your phone.
                  </Typography>
                </Card>

                {!showText && (
                  <div className="flex justify-center">
                    <a
                      data-tooltip-id="my-tooltip"
                      data-tooltip-place="right"
                      onClick={() => {
                        setShowText(true);
                      }}
                    >
                      <Tag
                        style={{ background: '#1DD297' }}
                        size="large"
                        className="hover:scale-125 cursor-pointer mt-6"
                      >
                        <b style={{ color: 'white' }}>?</b>
                      </Tag>
                    </a>
                  </div>
                )}
                
                {showText && (
                  <Typography
                    className="font-normal mt-6"
                    style={{
                      lineHeight: '1em',
                      fontSize: '0.6em',
                    }}
                  >
                    Get ready to feel more...{' '}
                    <span
                      className=""
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,154,0,1) 10%, rgba(208,222,33,1) 20%, rgba(79,220,74,1) 30%, rgba(63,218,216,1) 40%, rgba(47,201,226,1) 50%, rgba(28,127,238,1) 60%, rgba(95,21,242,1) 70%, rgba(186,12,248,1) 80%, rgba(251,7,217,1) 90%, rgba(255,0,0,1) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontStyle: 'italic',
                        fontWeight: 'bold',
                        fontSize: '2em',
                      }}
                    >
                      &nbsp;ALIVE&nbsp;
                    </span>
                  </Typography>
                )}
              </div>
            }
          />
          {loadingState === 'loading' && <Skeleton height={100} borderRadius={20} />}
        </div>

        {
          loadingState === 'loaded' &&

          <form
            id="form"
            className="form"

            // Toast Checks
            // (walletMaticBalance > parseFloat(CHALLENGE_COST))
            //  Boolean(address) && walletMaticBalance > parseFloat(CHALLENGE_COST) && screenTime > 0;
            onSubmit={async (e) => {
              e.preventDefault()
            }}>

            <div className="flex flex-col w-full gap-6 mt-0" style={{ direction: 'rtl' }}>
              <div style={{ direction: 'ltr', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '1.5em' }}>{videoWatched[0] ? '✅' : '→'}</div>
                <div
                  className="permanent-underline hover:scale-105"
                  style={{ fontSize: '1.2em' }}
                  onClick={() => {
                    handleWatchVideoClick(0);
                  }}
                >
                  <Typography style={{ cursor: 'pointer' }}>How does this work?</Typography>
                </div>
              </div>

              {videoWatched[0] && (
                <>
                  <div style={{ direction: 'ltr', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '1.5em' }}>{selectedTag !== null ? '✅' : '⬇️'}</div>
                    <div
                      style={{ fontSize: '1.2em' }}
                      onClick={() => {}}
                    >
                      <Typography>Select Leisure App</Typography>
                    </div>
                  </div>
                  <div className="flex justify-center mt-2" style={{ direction: 'ltr'}}>
                    <SocialTags
                      selectedTag={selectedTag}
                      setSelectedTag={setSelectedTag}
                      socialTagNames={socialTagNames}
                      isStyled={false}
                    />
                  </div>
                </>
              )}
            
              {selectedTag !== null && (
                <div className="flex flex-row mb-2 text-xs md:text-sm" style={{ direction: 'ltr' }}>
                  <div className="flex items-center w-3/5">
                    <Typography className="font-semibold">
                      {`Number of times you picked up ${capitalizeFirstLetter(socialTagNames[selectedTag])} on a daily average last week?`}
                    </Typography>
                    <a
                      data-tooltip-id="my-tooltip"
                      data-tooltip-place="right"
                      onClick={() => {
                        handleWatchVideoClick(1)
                      }}
                    >
                      <Tag
                        style={{ background: '#1DD297' }}
                        size="large"
                        className="hover:scale-110 cursor-pointer ml-4 mr-4"
                      >
                        <b style={{ color: 'white' }}>?</b>
                      </Tag>
                    </a>
                  </div>
                  <div className="w-2/5">
                    <Input
                      className="custom-input w-full"
                      placeholder="100"
                      min={1}
                      maxLength={3}
                      step={1}
                      inputMode="numeric"
                      onKeyDown={(e) => {
                        if (!/^\d*$/.test(e.key) && e.key !== 'Backspace') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => setScreenTime((e.target.value))}
                    />
                  </div>
                </div>
              )}

              {screenTime &&
                <div className="flex flex-row mb-2 -mt-2 text-xs md:text-sm" style={{ direction: 'ltr' }}>
                  <div className="flex items-center w-3/5">
                    <Typography className="font-semibold">
                      {`What is your daily average pickup goal for ${capitalizeFirstLetter(socialTagNames[selectedTag])} during the challenge?`}
                    </Typography>
                    <a
                      data-tooltip-id="my-tooltip"
                      data-tooltip-place="right"
                      onClick={() => {
                        handleWatchVideoClick(1)
                      }}
                    >
                      <Tag
                        style={{ background: '#1DD297' }}
                        size="large"
                        className="hover:scale-110 cursor-pointer ml-4 mr-4"
                      >
                        <b style={{ color: 'white' }}>?</b>
                      </Tag>
                    </a>
                  </div>
                  <div className="w-2/5">
                    <Input
                      className="custom-input w-full"
                      placeholder="100"
                      min={1}
                      maxLength={3}
                      step={1}
                      inputMode="numeric"
                      onKeyDown={(e) => {
                        if (!/^\d*$/.test(e.key) && e.key !== 'Backspace') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => setPickupGoal((e.target.value))}
                    />
                  </div>
                </div>
              }

              {pickupGoal && (
                <>
                  <div style={{ direction: 'ltr', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '1.5em' }}>{selectedBetAmount !== null ? '✅' : '⬇️'}</div>
                    <div
                      style={{ fontSize: '1.2em' }}
                      onClick={() => {}}
                    >
                      <Typography>Choose Bet Amount</Typography>
                    </div>
                  </div>
                  <div className="flex justify-center mt-2" style={{ direction: 'ltr'}}>
                    <SocialTags className=""
                      // hacky solution. not proud, but it works.
                      selectedTag={selectedBetAmount}
                      setSelectedTag={setSelectedBetAmount}
                      socialTagNames={betAmountOptions}
                      isStyled={true}
                    />
                  </div>
                </>
              )}

            </div>

           {/* Commit Button */}
           {(!((isWriteLoading || isWaitLoading)) && !hasCommitted) && selectedBetAmount !== null && (
              <>
                <div className="flex justify-center text-sm hover:cursor-pointer mt-6" style={{ direction: "ltr" }}>
                  <Input
                    label="Your Email (To Get A Reminder)"
                    placeholder="daniel@belfort.com"
                    // error={ userEmail && !userEmail.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ? ' ' : '' }
                    onChange={(e) => setUserEmail(e.target.value)}
                    labelSecondary={
                      <a
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Optional."
                        data-tooltip-place="top"
                      >
                        <Tag className="" style={{ background: "#1DD297" }} size="large">
                          <b style={{ color: "white" }}>?</b>
                        </Tag>
                      </a>
                    }
                  />
                </div>
              
                <ButtonThorin
                  style={{
                    width: "90%",
                    height: "2.8rem",
                    marginTop: "2rem",
                    marginBottom: "0rem",
                    backgroundColor: "rgb(29 210 151)", // isCommitButtonEnabled() ? "rgb(29 210 151)" : "rgb(29 210 151 / 36%)",
                    borderRadius: 12,
                    color: "white",
                    transition: "transform 0.2s ease-in-out",
                  }}
                  size="small"
                  shadowless
                  type="submit"
                  suffix={"(" + (parseFloat(stripDollarSign(betAmountOptions[selectedBetAmount])) / ethPrice).toFixed(2) + " ETH) "}
                  // disabled={!isCommitButtonEnabled()}
                  onClick={commitWrite}
                >
                  Commit
                </ButtonThorin>
              </>
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
                  <div className="flex justify-center w-3/10 mt-4">
                    <ButtonThorin
                      className="flex"
                      style={{ padding: "20px", backgroundColor: "#1DD297", boxShadow: "0px 2px 2px 1px rgb(0 0 0 / 80%)", borderRadius: "10px" }}
                      outlined
                      shape="rounded"
                      size="small"
                      variant="primary"
                      as="a"
                      href="./home"
                      onClick={() => {
                        localStorage.setItem("selectedFilter", "Active");
                      }}
                    >
                      View Commitment
                    </ButtonThorin>
                  </div>
                </div>
                <div className="flex justify-end w-full">
                  <div className="flex" style={{ width: "52px" }}>
                    <ButtonThorin
                      className="flex align-center mt-6 mb-5 sm:mb-0 justify-center rounded-lg hover:cursor-pointer"
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

            {/*ethPrice: {ethPrice}*/}

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
