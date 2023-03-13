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
import supabase from '../lib/db'

export default function CommitCard({ ...props }) {

  // clients
  const client_storage = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFiYWYzNkE2NGY2QjI3MDk3ZmQ4ZTkwMTA0NDAyZWNjQ2YxQThCMWEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njg5OTIxNzYwMzQsIm5hbWUiOiJqdXN0LWNvbW1pdC1kZXYifQ.zZBQ-nVOnOWjK0eZtCexGzpbV7BdO2v80bldS4ecE1E" })

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
  const [imageUrl, setImageUrl] = useState('/');

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
    args: [props.id],
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
  const proveWrite = useContractWrite({...proveCommitConfig,
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
  const uploadFile = async (file) => {
    setUploadClicked(true)

    const { data, error } = await supabase.storage.from("images").upload(file.name, file); // this works

    // on data
    if (data) {
      if (file.size.lastModified < props.createdAt * 1000) {
        toast.error("This pic is older than the commitment", { duration: 4000 })
      return;
      }
      setTriggerProveContractFunctions(true)
    }
    // on error
    if (error) {
      if (error.statusCode == "409") {
        toast.error("This picture is a duplicate", { duration: 4000 })
      }
      setUploadClicked(false);
      return;
    }
    
    if (!proveWrite.write) { // this if statement is ALWAYS true in its first call
      setUploadClicked(false)
      toast("🔁 Upload again (bug)", { duration: 4000 })
      return
    }

    proveWrite.write?.() // smart contract call 
    getImageUrl(file.name) // needed to render the <Image>
  }

  // retrieve the pic
  const getImageUrl = async (imageName) => {
    const { imageUrl, error } = await supabase.storage.from("images").getPublicUrl(imageName);

    if (error) {
      console.log(error);
      return;
    }

    console.log("imageUrl: ", imageUrl)
    setImageUrl(imageUrl);
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
                {
                  // active
                  (props.status == "Pending") ?
                    ((moment(props.endsAt).diff(moment(), 'days') >= 2) ?
                      "> " + moment(props.endsAt).diff(moment(), 'days') + " days left" :
                      <Countdown date={props.endsAt} daysInHours={true} />) :
                    // waiting or verify
                    (props.status == "Waiting") ?
                      moment(props.judgeDeadline).fromNow(true) + " left" :
                      // my history or feed
                      moment(props.createdAt * 1000).fromNow()
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
                    <FileInput maxSize={20} onChange={(file) => uploadFile(file)}>
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
            endsAt: {endsAt}
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
                    src={imageUrl}
                    // alt={imageName}
                    width={300}
                    height={300}
                    objectFit="cover"
                    style={{ borderRadius: "10px" }}
                  />

                  {/* "to verify" buttons */}

                  {/* TODO - is the props.commitTo check done right? */}
                  {props.commitTo.includes(address) && props.judgeDeadline > Date.now() && !props.commitJudged && (
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
          {props.endsAt}
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
