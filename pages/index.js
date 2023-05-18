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
import VideoModal from "../components/VideoModal.js";
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
  const commitTo = CONTRACT_OWNER
  const commitJudge = CONTRACT_OWNER
  const socialTagNames = ["insta", "tiktok", "twitter", "airchat", "snap"];
  const betAmountOptions = ["0", "10", "100"];

  // state
  const [loadingState, setLoadingState] = useState('loading')
  const [hasCommitted, setHasCommited] = useState(false)
  const [walletMaticBalance, setwalletMaticBalance] = useState(null)
  const [showVideoEmbed, setShowVideoEmbed] = useState(false);
  const [videoWatched, setVideoWatched] = useState([false, false, false]);
  const [videoEmbedUrl, setVideoEmbedUrl] = useState(null);
  const [showText, setShowText] = useState(false);
  const [userEmail, setUserEmail] = useState("null@null.com");
  const [appPickups, setAppPickups] = useState(null);
  const [pickupGoal, setPickupGoal] = useState(5);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedBetAmount, setSelectedBetAmount] = useState(null);
  const [args, setArgs] = useState([]);

  // // eth stats
  // const priceApi = useFetch('https://gas.best/stats')
  // const maticPrice = parseFloat(priceApi.data?.maticPrice)
  // polygon stats
  const priceApi = useFetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd')
  const maticPrice = parseFloat(priceApi.data?.["matic-network"].usd)

  // smart contract data
  const { chain, chains } = useNetwork()
  const { address } = useAccount()
  const provider = useProvider()

  // smart contract functions
  useEffect(() => {
    if (selectedBetAmount !== null && maticPrice) {
        setArgs([
          commitTo, 
          commitJudge, 
          appPickups, 
          pickupGoal, 
          socialTagNames[selectedTag],
          { 
            value: ethers.utils.parseEther((betAmountOptions[selectedBetAmount] / maticPrice).toString()) 
          }
        ]);
    }
  }, [selectedBetAmount, maticPrice]);
  const { config: createCommitConfig } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    functionName: "createCommit",
    args,
    enabled: args.length > 0, // enable the contract call when arguments are available
  });
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
      setwalletMaticBalance(parseFloat((Number(ethers.utils.formatEther(balanceMatic)))))
    } catch (err) {
      console.error("Error getting wallet balance:", err);
      return null;
    }
  }
  
  function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // commit logic related
  const closeModal = () => {
    setShowVideoEmbed(false);
  };
  const videoLinks = [
    'https://www.youtube.com/embed/_XTX4aZFEZQ',
    'https://www.youtube.com/embed/eIPuWFOont0',
    'https://www.youtube.com/embed/5sVuX8LljIg',
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

  const isCommitButtonEnabled = () => {
    return Boolean(address) &&
    chains.some((c) => c.id === chain.id) && 
    walletMaticBalance > parseFloat(betAmountOptions[selectedBetAmount] / maticPrice);
  };

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
                    Just Commit is a 1-month game challenge that is designed to
                    help you use an app on your phone less often.
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
                        className="hover:scale-150 cursor-pointer mt-6"
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
                    Start to feel more...{' '}
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {loadingState === 'loading' && <Skeleton height={100} width={460} borderRadius={20} />}
          </div>
        </div>

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
                toast.error('Connect your wallet', { id: 'wallet' });
                return;
              }
              // are you on the right network?
              if (!chains.some((c) => c.id === chain.id)) {
                toast.error('Switch chains', { id: 'network' });
                return;
              }
              // sufficient balance?
              if (walletMaticBalance < parseFloat(betAmountOptions[selectedBetAmount] / maticPrice)) {
                toast.error('Not enough funds', { id: 'funds' });
                return;
              }

            }}>

            {showVideoEmbed && (
              <VideoModal closeModal={closeModal} videoEmbedUrl={videoEmbedUrl} />
            )}

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
                  <Typography style={{ cursor: 'pointer' }}>Why am I here?</Typography>
                </div>
              </div>

              {videoWatched[0] && (
                <>
                  <div style={{ direction: 'ltr', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '1.5em' }}>{videoWatched[1] ? '✅' : '→'}</div>
                    <div
                      className="permanent-underline hover:scale-105"
                      style={{ fontSize: '1.2em' }}
                      onClick={() => {
                        handleWatchVideoClick(1);
                      }}
                    >
                      <Typography style={{ cursor: 'pointer' }}>How does this work?</Typography>
                    </div>
                  </div>
               </>
              )}

              {videoWatched[1] && (
                <>
                  <div style={{ direction: 'ltr', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '1.5em' }}>{selectedTag !== null ? '✅' : '⬇️'}</div>
                    <div
                      style={{ fontSize: '1.2em' }}
                      onClick={() => {}}
                    >
                      <Typography>Select App</Typography>
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
                        handleWatchVideoClick(2)
                      }}
                    >
                      <Tag
                        style={{ background: '#1DD297' }}
                        size="large"
                        className="hover:scale-110 cursor-pointer ml-4 mr-4"
                      >
                        <b style={{ color: 'white' }}>↗</b>
                      </Tag>
                    </a>
                  </div>
                  <div className="w-2/5">
                    <Input
                      className="custom-input w-full"
                      placeholder="42"
                      min={1}
                      maxLength={3}
                      step={1}
                      inputMode="numeric"
                      onKeyDown={(e) => {
                        if (!/^\d*$/.test(e.key) && e.key !== 'Backspace') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => setAppPickups((e.target.value))}
                    />
                  </div>
                </div>
              )}

              {appPickups &&
                <div className="flex flex-row mb-2 -mt-2 text-xs md:text-sm" style={{ direction: 'ltr' }}>
                  <div className="flex items-center w-3/5">
                    <Typography className="font-semibold">
                      {`Your daily average pickup goal for ${capitalizeFirstLetter(socialTagNames[selectedTag])} during the challenge →`}
                    </Typography>
                    <a
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content="You can't change this."
                      data-tooltip-place="top"
                    >
                      <Tag className="ml-4 mr-4 hover:cursor-pointer" style={{ background: "#1DD297" }} size="large">
                        <b style={{ color: "white" }}>?</b>
                      </Tag>
                    </a>
                  </div>
                  <div className="w-2/5">
                    <Input
                      className="custom-input w-full"
                      disabled={true}
                      placeholder="5"
                      min={1}
                      maxLength={2}
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

              {appPickups && (
                <>
                  <div style={{ direction: 'ltr', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '1.5em' }}>{selectedBetAmount !== null ? '✅' : '⬇️'}</div>
                    <div
                      style={{ fontSize: '1.2em' }}
                      onClick={() => {}}
                    >
                      <Typography>Bet On Yourself</Typography>
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

           {/* Commit Button Section */}
            {selectedBetAmount !== null && (
              <>
                <div className="flex justify-center text-sm hover:cursor-pointer mt-6" style={{ direction: "ltr" }}>
                  {/* Email Input */}
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
                        <Tag style={{ background: "#1DD297" }} size="large">
                          <b style={{ color: "white" }}>?</b>
                        </Tag>
                      </a>
                    }
                  />
                </div>
                {/* MATIC Conversion Tag */}
                <div className="flex justify-center mt-2 mb-2">
                  <a
                    data-tooltip-id="my-tooltip"
                    data-tooltip-place="right"
                    data-tooltip-content={"1 MATIC 🟰 " + formatCurrency(maticPrice, "USD")}
                  >
                    <Tag
                      style={{ background: '#1DD297' }}
                      size="large"
                      className="cursor-pointer"
                    >
                      <b style={{ color: 'white' }}>?</b>
                    </Tag>
                  </a>
                </div>
                {/* Commit Button */}
                {!((isWriteLoading || isWaitLoading)) && !hasCommitted && (
                  <ButtonThorin
                    style={{
                      width: "90%",
                      height: "2.8rem",
                      marginTop: "0rem",
                      marginBottom: "0rem",
                      backgroundColor: isCommitButtonEnabled() ? "rgb(29 210 151)" : "rgb(29 210 151 / 36%)",
                      borderRadius: 12,
                      color: "white",
                      transition: "transform 0.2s ease-in-out",
                    }}
                    size="small"
                    shadowless
                    type="submit"
                    suffix={"(" + (parseFloat(betAmountOptions[selectedBetAmount]) / maticPrice).toFixed(0) + " MATIC) "}
                    // disabled={!isCommitButtonEnabled()}
                    onClick={isCommitButtonEnabled() ? commitWrite : undefined}
                  >
                    Commit
                  </ButtonThorin>
                )}
              </>
            )}

            <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
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
                      className="flex align-center mt-6 mb-5 ml-5 sm:mb-0 justify-center rounded-lg hover:cursor-pointer"
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

            {/*maticPrice: {maticPrice}*/}

            {/*
            <br></br>
            socialTagNames[selectedTag]: {socialTagNames[selectedTag]}
            <br></br>
            betAmountOptions[selectedBetAmount]: {betAmountOptions[selectedBetAmount]}
            <br></br>
            appPickups: {appPickups}
            <br></br>
            pickupGoal: {pickupGoal}
            <br></br>
            betAmountOptions[selectedBetAmount] / maticPrice: {betAmountOptions[selectedBetAmount] / maticPrice}
            <br></br>
            walletMaticBalance: {walletMaticBalance}
            <br></br>
            isCommitButtonEnabled: {isCommitButtonEnabled}
            */}
            
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
