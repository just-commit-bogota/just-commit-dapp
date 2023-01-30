import { FileInput, Tag, Button as ButtonThorin } from '@ensdomains/thorin'
import React, { useState } from 'react'
import classNames from 'classnames'
import Countdown from 'react-countdown';
import { Web3Storage } from 'web3.storage'
import { useAccount, useNetwork, useProvider } from 'wagmi'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import moment from 'moment/moment';
import Spinner from "../components/Spinner.js";
import { useStorage } from '../hooks/useStorage.ts'
import toast, { Toaster } from 'react-hot-toast'
import { CONTRACT_ADDRESS, ABI } from '../contracts/CommitManager.ts';

// dummy token
const client = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFiYWYzNkE2NGY2QjI3MDk3ZmQ4ZTkwMTA0NDAyZWNjQ2YxQThCMWEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njg5OTIxNzYwMzQsIm5hbWUiOiJqdXN0LWNvbW1pdC1kZXYifQ.zZBQ-nVOnOWjK0eZtCexGzpbV7BdO2v80bldS4ecE1E" })

export default function CommitCard({ ...props }) {

  // variables
  const { getItem, setItem, removeItem } = useStorage()
  const CommitStatusEmoji = {
    "Pending": "❓", // picture not yet submitted
    "Waiting": "⏳", // picture submitted waiting for commitTo judging
    "Failure": "❌", // time expired or picture denied
    "Success": "✅", // picture accepted :) 
  }

  // state
  const [triggerProveContractFunctions, setTriggerProveContractFunctions] = useState(false)
  const [triggerJudgeContractFunctions, setTriggerJudgeContractFunctions] = useState(false)

  // smart contract data 
  const provider = useProvider()
  const { chain, chains } = useNetwork()
  const { address } = useAccount()

  // smart contract functions

  // prepare
  const { config: proveCommitConfig } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    functionName: "proveCommit",
    args: [props.id, getItem('ipfsHash', 'session')],
    enabled: triggerProveContractFunctions,
  })
  const { config: judgeCommitConfig } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    functionName: "judgeTheCommit",
    args: [props.id, getItem('isApproved', 'session')],
    enabled: triggerJudgeContractFunctions,
  })
  
  // write
  const proveWrite = useContractWrite({...proveCommitConfig,
    onSettled() {{ proveWait }},
  })
  const judgeWrite = useContractWrite({...judgeCommitConfig,
    onSettled() {{ judgeWait }},
  })
  
  // wait
  const { wait: proveWait, data: proveWaitData, isLoading: isProveWaitLoading } = useWaitForTransaction({
    hash: proveWrite.data?.hash,
    onSettled() {
      location.reload()
    }
  })
  const { wait: judgeWait, data: judgeWaitData, isLoading: isJudgeWaitLoading } = useWaitForTransaction({
    hash: judgeWrite.data?.hash,
    onSettled() {
      location.reload()
    }
  })

  // functions
  const uploadFile = () => {
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput.size > 0) {
      client.put(fileInput.files, {
        name: 'fileInput',
        maxRetries: 3,
      }).then(cid => {
        removeItem('ipfsHash', "session")
        setItem('ipfsHash', cid, "session")
        setTriggerProveContractFunctions(true)

        if (!proveWrite.write) {
          toast("🔁 Refresh and upload a dummy pic", {duration: 3000})
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
            <div className="w-4/5 text-sm block">{props.message}</div>
            <div className="flex align-left space-x-2">
              <div className="text-sm text-slate-400 opacity-80" style={{ whiteSpace: "nowrap" }}>
                {
                  // active
                  (props.status == "Pending") ?
                    <Countdown date={props.validThrough} daysInHours></Countdown> :
                    // waiting or verify
                    (props.status == "Waiting") ?
                    <>Due in <Countdown date={props.judgeDeadline} daysInHours></Countdown></> :
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
            'pictureArea--failure': props.status == "Failure",
            'pictureArea--pending': props.status == "Pending",
          })}>
            {/* CARD BODY */}

            {/* ACTIVE BODY */}
            {props.status == "Pending" &&
              <>
                <div className="flex flex-col" style={{ alignItems: "center" }}>
                  <div className="flex">
                    <FileInput maxSize={10} onChange={(file) => uploadFile()}>
                      {(context) =>
                        (isProveWaitLoading || proveWrite.isLoading) ?
                          <Spinner />
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
                              &nbsp;✅&nbsp;
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
                              {console.log(context)}
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
            isProveLoading: {String(isProveLoading)}
            <br></br>
            <br></br>
            */}

            {/*
            validThrou.: {validThrough}
            <br></br>
            <br></br>
            Date.now(): {Date.now()}
            */}

            {/* WAITING/VERIFY OR SUCCESS BODY */}
            {(props.status == "Waiting" || props.status == "Success") &&
              <>
                <div className="flex flex-col gap-10" style={{ alignItems: "center" }}>
                  <Tag
                    className="text-2xl hover:cursor-pointer"
                    tone="accent"
                    size="large"
                    onClick={() => {
                      window.open(
                        `https://ipfs.io/ipfs/${props.ipfsHash}`,
                        "_blank",
                        "noopener,noreferrer")
                    }}
                  >
                    &nbsp;📸&nbsp;
                  </Tag>
                  {/* THE VERIFY VARIANT */}
                  {props.commitTo == address && props.judgeDeadline > Date.now() && !props.commitJudged && (
                    <div>
                      <div className="flex flex-row gap-5" style={{ justifyContent: "space-between", marginBottom: "-30px" }}>
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
          <div className="flex flex-row text-xs pt-4" style={{ justifyContent: "space-between" }}>
            <div className="flex flex-col w-1/2 lg:w-1/3" style={{
              justifyContent: "space-between",
              borderLeft: "2px solid rgba(0, 0, 0, 0.18)",
              borderRight: "2px solid rgba(0, 0, 0, 0.18)",
              borderRadius: "6px",
            }}>
              <div className="flex flex-row" style={{ justifyContent: "space-between" }}>
                <b>&nbsp;From </b>{props.commitFrom.slice(0, 5)}...{props.commitFrom.slice(-4)}&nbsp;
              </div>
              <div className="flex flex-row" style={{ justifyContent: "space-between" }}>
                <b>&nbsp;To </b>justcommit.eth&nbsp;
                {/*<b>&nbsp;To </b>{props.commitTo.slice(0, 5)}...{props.commitTo.slice(-4)}&nbsp;*/}
              </div>
            </div>
            <div className="flex flex-row w-1/5 align-center justify-center"
              style={{ border: "2px solid rgba(130, 71, 229)", borderRadius: "6px" }}>
              <div className="flex flex-row p-1">
                <div className="flex flex-col align-center justify-center">
                  <img className="h-4" src="./polygon-logo-tilted.svg" />
                </div>
                <div className="flex flex-col font-semibold align-center justify-center text-xs">&nbsp;{props.stakeAmount}</div>
              </div>
            </div>
            <div className="flex flex-col align-center justify-center text-lg">
            {
              props.status != "Pending" ?
                CommitStatusEmoji[props.status]
              :
                <Tag
                  className="text-2xl hover:cursor-pointer"
                  tone="accent"
                  size="medium"
                  onClick={() => { toast("ℹ️ It's the first pic that counts!") }}
                >
                  &nbsp;{"ℹ️"}&nbsp;
                </Tag>
            }
            </div>
            <div className="flex flex-col w-1/10 font-medium align-center justify-center text-blue-600
              text-xs rounded-lg bg-sky-200 hover:bg-sky-400 hover:cursor-pointer">
              <a onClick={() => { toast("⏳ Working on it...") }}>
                {/*}
              <a href={`https://${chain?.id === 5 ? 'goerli.' : ''
                }etherscan.io/tx/${props.txnHash}`} // FIX 
                target="_blank"
                rel="noreferrer"
              >
              */}
                &nbsp;&nbsp;Txn&nbsp;&nbsp;
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