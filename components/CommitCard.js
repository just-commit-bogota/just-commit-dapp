import { FileInput, Tag, Button as ButtonThorin } from '@ensdomains/thorin'
import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import Countdown from 'react-countdown';
import { useAccount, useEnsName } from 'wagmi'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import moment from 'moment/moment';
import Spinner from "../components/Spinner.js";
import { useStorage } from '../hooks/useStorage.ts'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'
import { CONTRACT_ADDRESS, ABI } from '../contracts/CommitManager.ts';
import { Web3Storage } from 'web3.storage'
//import { twilio } from 'twilio'

export default function CommitCard({ ...props }) {

  // clients
  const client_storage = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN })
  //const client_twilio = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

  // tokens
  const TWILIO_ACCOUNT_SID = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID
  const TWILIO_AUTH_TOKEN = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN
  const TWILIO_NUMBER = process.env.NEXT_PUBLIC_TWILIO_NUMBER
  const DESTINATION_NUMBER = process.env.NEXT_PUBLIC_DESTINATION_NUMBER

  // variables
  const { getItem, setItem, removeItem } = useStorage()
  const CommitStatusEmoji = {
    "Pending": "⚡", // picture not yet submitted
    "Waiting": "⏳", // picture submitted and waiting
    "Failure": "❌", // time expired or picture denied
    "Success": "✅", // picture accepted :) 
  }

  // state
  const [triggerProveContractFunctions, setTriggerProveContractFunctions] = useState(false)
  const [triggerJudgeContractFunctions, setTriggerJudgeContractFunctions] = useState(false)
  const [uploadClicked, setUploadClicked] = useState(false)

  // variables
  const { address } = useAccount()

  // function to resolve ENS name on ETH mainnet
  const { data: ensName } = useEnsName({
    address: props.commitFrom,
    chainId: 1, // ETH Mainnet
    staleTime: 0,
    onError(err) {
      console.log(err)
    },
  })

  // prepare
  const { config: proveCommitConfig } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    functionName: "proveCommit",
    args: [props.id, getItem('ipfsHash', 'session'), getItem('filename', 'session')],
    enabled: triggerProveContractFunctions,
  })
  const { config: judgeCommitConfig } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    functionName: "judgeCommit",
    args: [props.id, getItem('isApproved', 'session')],
    enabled: triggerJudgeContractFunctions,
  })

  // write
  const proveWrite = useContractWrite({
    ...proveCommitConfig,
    onSettled() { { proveWait } },
    onError: (err) => {
      setUploadClicked(false)
      const regex = /code=(.*?),/;
      const match = regex.exec(err.message);
      const code = match ? match[1] : null;
      if (code === "ACTION_REJECTED") {
        toast.error("Transaction Rejected")
      }
    }
  })
  const judgeWrite = useContractWrite({
    ...judgeCommitConfig,
    onSettled() { { judgeWait } },
  })

  // wait
  const { wait: proveWait, data: proveWaitData, isLoading: isProveWaitLoading } = useWaitForTransaction({
    hash: proveWrite.data?.hash,
    onSettled() {
      // wait 10 seconds
      setTimeout(() => { }, 10000);
      location.reload()
    }
  })
  const { wait: judgeWait, data: judgeWaitData, isLoading: isJudgeWaitLoading } = useWaitForTransaction({
    hash: judgeWrite.data?.hash,
    onSettled() {
      location.reload()
    }
  })

  // FUNCTIONS

  // upload the pic
  const uploadFile = () => {
    setUploadClicked(true)

    const fileInput = document.querySelector('input[type="file"]')

    removeItem('filename', "session")
    setItem('filename', fileInput.files[0].name, "session")

    if (fileInput.size > 0) {

      if (fileInput.files[0].lastModified < props.createdAt) {
        setUploadClicked(false)
        toast.error("This pic is older than the commitment", { duration: 4000 })
        return
      }

      client_storage.put(fileInput.files, {
        name: 'fileInput',
        maxRetries: 3,
      }).then(cid => {
        removeItem('ipfsHash', "session")
        setItem('ipfsHash', cid, "session")
        setTriggerProveContractFunctions(true)

        if (!proveWrite.write) {
          setUploadClicked(false)
          toast("🔁 Upload again (bug)", { duration: 4000 })
          return
        }
        proveWrite.write?.()
      })
    }
  }

  return (
    <>
      <div style={{ borderRadius: "12px" }} className={classNames({
        'styledBorder': true,
        'styledBorder--waiting': props.status == "Waiting",
        'styledBorder--success': props.status == "Success",
        'styledBorder--failure': props.status == "Failure",
        'styledBorder--pending': props.status == "Pending",

      })}>
        <div className="flex flex-col bg-white p-2.5" style={{ borderRadius: "12px" }}>
          <div className="flex flex-row" style={{ justifyContent: "space-between" }}>
            <div className="text-sm block">{props.message}</div>
            <div className="flex space-x-2" style={{ whiteSpace: "nowrap" }}>
              <div className="span flex text-sm text-slate-400 gap-2 opacity-80" style={{ whiteSpace: "nowrap" }}>
                {props.isChallenge && (
                  <div className="flex">
                    <Tag
                      className="text-xs justify-center align-center hover:cursor-pointer"
                      tone="blue"
                      size="large"
                      onClick={() => { }}
                    >
                      {localStorage.getItem("commitIndex")}
                      /
                      {localStorage.getItem("challengeDays")}
                    </Tag>
                  </div>
                )}
                {props.isChallenge && (
                  <div className="flex -ml-1">
                    <Tag
                      className="text-xs justify-center align-center hover:cursor-pointer"
                      tone="red"
                      size="large"
                      onClick={() => { }}
                    >
                      {localStorage.getItem("totalFailedSoFarInChallenge")}
                      /
                      {localStorage.getItem("canMiss")}
                    </Tag>
                  </div>
                )}
                {
                  // active
                  (props.status == "Pending") ?
                    ((moment(props.validThrough).diff(moment(), 'days') >= 2) ?
                      "> " + moment(props.validThrough).diff(moment(), 'days') + " days left" :
                      <Countdown date={props.validThrough} daysInHours={true} />) :
                    // waiting or verify
                    (props.status == "Waiting") ?
                      moment(props.judgeDeadline).fromNow(true) + " left (verifier)" :
                      // my history or feed
                      moment(props.createdAt).fromNow()
                }
              </div>
            </div>
          </div>
          <div className={classNames({
            'pictureArea': true,
            'pictureArea--waiting': props.status == "Waiting",
            'pictureArea--success': props.status == "Success",
            'pictureArea--failure': props.status == "Failure" && !props.commitProved,
            'pictureArea--pending': props.status == "Pending",
          })}>
            {/* CARD BODY */}

            {/* card is active */}
            {props.status == "Pending" &&
              <>
                <div className="flex flex-col" style={{ alignItems: "center" }}>
                  <div className="flex">
                    <FileInput maxSize={20} onChange={(file) => uploadFile()}>
                      {(context) =>
                        (uploadClicked || isProveWaitLoading || proveWrite.isLoading) ?
                          <div className="flex flex-col" style={{ alignItems: "center" }}>
                            <Spinner />
                            <div className="heartbeat text-xs">(Don&#39;t Refresh)</div>
                          </div>
                          :
                          (context.name && triggerProveContractFunctions) ?
                            <div>
                              <a
                                className="text-4xl hover:cursor-pointer"
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  location.reload();
                                }}
                              >
                                &nbsp;🔁&nbsp;
                              </a>
                            </div>
                            :
                            <div>
                              <Tag
                                className="text-2xl hover:cursor-pointer"
                                tone="accent"
                                variation="primary"
                                size="large"
                              >
                                &nbsp;📷&nbsp;
                              </Tag>
                            </div>
                      }
                    </FileInput>
                  </div>
                </div>
              </>
            }

            {/*
            ---------
            DEBUGGING
            ---------
            */}

            {/*
            isProveWaitLoading: {String(isProveWaitLoading)}
            <br></br>
            <br></br>
            */}

            {/*
            validThrough: {validThrough}
            <br></br>
            <br></br>
            Date.now(): {Date.now()}
            */}

            {/* show the image if there's an image to show */}
            {(props.commitProved) &&
              <>
                <div className="flex flex-col" style={{ alignItems: "center" }}>

                  <Image
                    className="object-cover"
                    unoptimized
                    loader={() => `https://${props.ipfsHash}.ipfs.dweb.link/${props.filename}`}
                    src={`https://${props.ipfsHash}.ipfs.dweb.link/${props.filename}`}
                    alt="IPFS picture"
                    width={300}
                    height={300}
                    style={{
                      borderRadius: "10px",
                    }}
                  />

                  {/* "to verify" buttons */}
                  {props.commitTo == address && props.judgeDeadline > Date.now() && !props.commitJudged && (
                    <div>
                      <div className="flex flex-row gap-5 p-5" style={{ justifyContent: "space-between", marginBottom: "-30px" }}>
                        {
                          isJudgeWaitLoading ?
                            <Spinner /> :
                            <>
                              <ButtonThorin
                                tone="red"
                                size="small"
                                variant="secondary"
                                outlined
                                onClick={() => {
                                  removeItem('isApproved', "session")
                                  setItem('isApproved', false, "session")
                                  setTriggerJudgeContractFunctions(true)
                                  // console.log(judgeCommitConfig)
                                  judgeWrite.write?.()
                                }}
                              >
                                Reject
                              </ButtonThorin>
                              <ButtonThorin
                                tone="green"
                                size="small"
                                variant="secondary"
                                outlined
                                onClick={() => {
                                  removeItem('isApproved', "session")
                                  setItem('isApproved', true, "session")
                                  setTriggerJudgeContractFunctions(true)
                                  judgeWrite.write?.()
                                }}
                              >
                                Approve
                              </ButtonThorin>
                            </>
                        }
                      </div>
                    </div>
                  )}
                </div>
              </>
            }
          </div>

          {/* FOOTER */}
          <div className="flex flex-row text-xs pt-2" style={{ justifyContent: "space-between" }}>
            <div className="flex flex-col w-1/2 lg:w-1/2" style={{
              justifyContent: "space-between",
              borderLeft: "2px solid rgba(0, 0, 0, 0.18)",
              borderRight: "2px solid rgba(0, 0, 0, 0.18)",
              borderRadius: "6px",
            }}>
              <div className="flex flex-row" style={{ justifyContent: "space-between" }}>
                <b>&nbsp;From </b>{ensName || props.commitFrom.slice(0, 5) + '…' + props.commitFrom.slice(-4)}&nbsp;
              </div>
              <div className="flex flex-row" style={{ justifyContent: "space-between" }}>
                <b>&nbsp;To </b>justcommit.eth&nbsp;
                {/*<b>&nbsp;To </b>{props.commitTo.slice(0, 5)}...{props.commitTo.slice(-4)}&nbsp;*/}
              </div>
            </div>

            <div className="flex flex-row p-1">
              <div className="flex flex-col align-center justify-center">
                <img className="h-6" src="./polygon-logo-tilted.svg" />
              </div>
              <div className="flex flex-col font-semibold align-center justify-center text-l ml-1">{parseFloat(props.stakeAmount).toFixed(2)}</div>
            </div>

            <div className="flex flex-col align-center justify-center text-lg">
              {
                CommitStatusEmoji[props.status]
              }
            </div>
            <div className="flex flex-col w-1/10 font-medium align-center justify-center text-blue-600
              text-l rounded-lg bg-sky-200 hover:bg-sky-400 hover:cursor-pointer">
              <a onClick={() => { toast("⏳ Coming Soon...", { id: 'unique' }) }}>
                {/*}
              <a href={`https://${chain?.id === 5 ? 'goerli.' : ''
                }etherscan.io/tx/${props.txnHash}`} // FIX 
                target="_blank"
                rel="noreferrer"
              >
              */}
                &nbsp;&nbsp;&nbsp;🔎&nbsp;&nbsp;&nbsp;
              </a>
            </div>
          </div>
        </div>

        <Toaster toastOptions={{ duration: 2000 }} />

        {/*
          <br></br>
          {hasProved}
          {props.validThrough}
          <br></br>
          {props.createdAt}
          <br></br>
          {Date.now()}
          <br></br>
          {txnHash}
        */}

      </div>
    </>
  )
}


