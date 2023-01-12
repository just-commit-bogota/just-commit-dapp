import { FileInput, Tag, CloseSVG, Button as ButtonThorin } from '@ensdomains/thorin'
import React, { useState } from 'react'
import classNames from 'classnames'
import abi from "../contracts/CommitManager.json";
import Countdown from 'react-countdown';
import { Web3Storage } from 'web3.storage'
import { useAccount, useNetwork, useProvider } from 'wagmi'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import moment from 'moment/moment';
import Spinner from "../components/Spinner.js";
import { useStorage } from '../hooks/useLocalStorage.ts'

const CONTRACT_ADDRESS = "0x17C7B7a3DcF9D5c43056787292104F85EAb19d00"

// dummy token
const client = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFiYWYzNkE2NGY2QjI3MDk3ZmQ4ZTkwMTA0NDAyZWNjQ2YxQThCMWEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njg5OTIxNzYwMzQsIm5hbWUiOiJqdXN0LWNvbW1pdC1kZXYifQ.zZBQ-nVOnOWjK0eZtCexGzpbV7BdO2v80bldS4ecE1E" })

export default function CommitCard({ ...props }) {

  // variables
  const { getItem, setItem } = useStorage()
  const CommitStatusEmoji = {
    "Pending": "❓", // picture not yet submitted
    "Waiting": "⏳", // picture submitted waiting for commitTo judging
    "Failure": "❌", // time expired or picture denied
    "Success": "✅", // picture accepted :) 
  }

  // smart contract data 
  const provider = useProvider()
  const { chain, chains } = useNetwork()
  const { address } = useAccount()

  // smart contract functions
  const { config: proveCommitConfig } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abi.abi,
    functionName: "proveCommit",
    args: [props.id, getItem('ipfsHash')]
  })
  const { write: proveWrite, data: proveCommitData, isLoading: isProveLoading } = useContractWrite({
    ...proveCommitConfig,
    onSettled(proveCommitConfig, error) {
      location.reload()
    },
  })

  // functions
  const uploadFile = () => {
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput.size > 0) {
      client.put(fileInput.files, {
        name: 'fileInput',
        maxRetries: 3,
      }).then(cid => {
        setItem('ipfsHash', cid) // get this line to work
        proveWrite()
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
                  (props.validThrough) > Date.now() ?
                    <Countdown date={props.validThrough} daysInHours></Countdown> :
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
                    <FileInput maxSize={1} onChange={(file) => uploadFile()}>
                      {(context) =>
                        context.name ?
                          <Spinner />
                          :
                          <div>{context.droppable ? 'Upload' :
                            <Tag
                              className="text-2xl hover:cursor-pointer"
                              tone="green"
                              variation="primary"
                              size="Large"
                            >
                              &nbsp;📷&nbsp;
                            </Tag>}
                          </div>
                      }
                    </FileInput>
                  </div>
                </div>
              </>
            }
            {/* WAITING OR VERIFY BODY */}
            {props.status == "Waiting" &&
              <>
                <div className="flex flex-col" style={{ alignItems: "center" }}>
                <Tag
                    className="text-2xl hover:cursor-pointer"
                    tone="green"
                    size="Large"
                    onClick={() => {
                      window.open(
                    	`https://ipfs.io/ipfs/${props.ipfsHash}`,
                    	"_blank",
                    	"noopener, noreferrer")
                    }}
                  >
                    &nbsp;📸&nbsp;
                  </Tag>
                  {/* ACCEPT OR REJECT BUTTONS */}
                  {props.commitTo == address && (
                    <div>
                      <br></br>
                      <div className="flex flex-row gap-5" style={{ justifyContent: "space-between" }}>
                        <ButtonThorin
                          shape="rounded"
                          tone="red"
                          size="small"
                        >
                          Reject
                        </ButtonThorin>
                        <ButtonThorin
                          shape="rounded"
                          tone="green"
                          size="small"
                        >
                          Approve
                        </ButtonThorin>
                      </div>
                      <br></br>
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
                <b>&nbsp;To </b>{props.commitTo.slice(0, 5)}...{props.commitTo.slice(-4)}&nbsp;
              </div>
            </div>
            <div className="flex flex-row w-1/5 align-center justify-center"
              style={{ border: "2px solid rgba(50, 50, 50, .5)", borderRadius: "10px" }}>
              <div className="flex flex-row p-1">
                <div className="flex flex-col align-center justify-center">
                  <img className="h-4" src="./ethereum-logo.png" />
                </div>
                <div className="flex flex-col font-semibold align-center justify-center text-xs">&nbsp;{props.stakeAmount}</div>
              </div>
            </div>
            <div className="flex flex-col align-center justify-center text-lg">{CommitStatusEmoji[props.status]}</div>
            <div className="flex flex-col w-1/10 font-medium align-center justify-center text-blue-600 text-xs rounded-lg bg-sky-200 hover:bg-sky-400">
              <a href={`https://${chain?.id === 5 ? 'goerli.' : ''
                }etherscan.io/tx/${props.txnHash}`} // FIX
                target="_blank"
                rel="noreferrer"
              >
                &nbsp;&nbsp;Txn&nbsp;&nbsp;
              </a>
            </div>
          </div>
        </div>
        {/*
          DEBUGGING
          <br></br>
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