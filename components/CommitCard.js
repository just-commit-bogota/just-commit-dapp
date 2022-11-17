import Button from '@mui/material/Button'
import React, {useState}  from 'react'
import classNames from 'classnames'
import abi from "../contracts/CommitManager.json";
import Modal from 'react-modal'
import Countdown from 'react-countdown';
import { Web3Storage } from 'web3.storage'
import { useAccount, useNetwork, useProvider } from 'wagmi'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import moment from 'moment/moment';

const contractAddress = "0x33CaC3508c9e3C50F1ae08247C79a8Ed64ad82a3"
const web3StorageToken = process.env['WEB3_STORAGE_TOKEN']
const client = new Web3Storage({ token: web3StorageToken})   

export default function CommitCard ({...props}) {

  // state
  const [proofIpfsHash, setProofIpfsHash] = useState(props.ipfsHash);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [verifyModalIsOpen, setVerifyIsOpen] = React.useState(false);
  let subtitle;
  const CommitStatusEmoji = {
	  "Pending": "❓", // picture not yet submitted
  	"Waiting": "⏳", // picture submitted waiting for commitTo judging
  	"Failure": "❌",
    "Success": "✅",
  }

  // smart contract data 
  const provider = useProvider()
  const { chain, chains } = useNetwork()
  const { address: isConnected } = useAccount()
  const { config } = usePrepareContractWrite({
      addressOrName: contractAddress,
      contractInterface: abi.abi,
      functionName: "proveCommit",
      args: [props.id, proofIpfsHash ]
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)
  
  const { config: verifyConfig } = usePrepareContractWrite({
      addressOrName: contractAddress,
      contractInterface: abi.abi,
      functionName: "judgeCommit",
      args: [props.id, true]

  })
  const { write: verifyWrite } = useContractWrite(verifyConfig)

  // modal functions
  const uploadFile = () => { 
    const fileInput = document.querySelector('input[type=file]');
    if (fileInput.files.length > 0) {
      console.log(client)
      console.log(fileInput)
      client.put(fileInput.files, {
          name: 'file',
          maxRetries: 3,
      }).then(cid => {
        setProofIpfsHash(cid);
        if (write) {
          write();
        }
      });
    }
  }

  const verifyProof = () => { 
    verifyWrite();
  }

  function openModal() {
      console.log('openUploadModal')
      setIsOpen(true);
  }

  function openVerifyModal() {
      console.log('openVerifyModal')
      setVerifyIsOpen(true);
  }

  function afterOpenModal() {
      subtitle.style.color = '#f00';
  }

  function closeModal() {
      setIsOpen(false);
  }

  function closeVerifyModal() {
      setVerifyIsOpen(false);
  }

  // buttonType state
  let buttonType = 'none';
  if (props.status == "Pending") {
      buttonType = "Upload"
  } else if (props.status == "Waiting" && !props.userIsCreator) {
      buttonType = "Verify"
  } else if (props.status == "Failure" && props.userIsCommitee) {
      buttonType = "Claim"
  }

  return (
    <>
      <div style={{ borderRadius: "12px"}} className = {classNames({
        'styledBorder': true,
        'styledBorder--waiting': props.status == "Waiting",
        'styledBorder--success': props.status == "Success",
        'styledBorder--failure': props.status == "Failure",
        'styledBorder--pending': props.status == "Pending",

      })}>
        <div className="bg-white p-3" style={{ borderRadius: "12px"}}>
          <div className="flex flex-row" style = {{justifyContent: "space-between"}}>
            <div className="w-4/5 text-sm block">{props.message}</div>
            <div className="flex align-left space-x-2">
              <div className="text-sm text-slate-400 opacity-80" style= {{whiteSpace: "nowrap"}}>
                { (props.expiryTimestamp*1000) > Date.now() ? <Countdown date={props.expiryTimestamp} daysInHours></Countdown> : moment(props.createdTimestamp*1000).fromNow()}
              </div>
            </div>
          </div>
          <br></br>
          <br></br>
          {/* <img style={{margin:"0 -8px", maxWidth:"105%", borderRadius:"6px"}} src="./dummy-pic-1.png" /> */}
          <div className="flex flex-row text-xs pt-4" style={{justifyContent: "space-between"}}>
            <div className="flex flex-col w-1/2 lg:w-1/3" style={{
              justifyContent: "space-between",
              borderLeft:"2px solid rgba(0, 0, 0, 0.18)",
              borderRight:"2px solid rgba(0, 0, 0, 0.18)",
              borderRadius: "6px",
            }}>
              <div className="flex flex-row" style={{justifyContent: "space-between"}}>
                <b>&nbsp;From </b>{props.commitFrom.slice(0, 5)}...{props.commitFrom.slice(-4)}&nbsp;
              </div>
              <div className="flex flex-row" style={{justifyContent: "space-between"}}>
                <b>&nbsp;To </b>{props.commitTo.slice(0, 5)}...{props.commitTo.slice(-4)}&nbsp;
              </div>
            </div>
            <div className="flex flex-row w-1/5 align-center justify-center"
                 style={{border:"2px solid rgba(50, 50, 50, .5)", borderRadius: "10px"}}>
              <div className="flex flex-row p-1">
                <div className="flex flex-col align-center justify-center">
                  <img className="h-4" src="./ethereum-logo.png" />
                </div>
                <div className="flex flex-col font-semibold align-center justify-center text-xs">&nbsp;{props.stakeAmount}</div>
              </div>
            </div>
            <div className="flex flex-col align-center justify-center text-lg">{CommitStatusEmoji[props.status]}</div>
            <div className="flex flex-col w-1/10 font-medium align-center justify-center text-blue-600 text-xs rounded-lg bg-sky-200 hover:bg-sky-400">
              <a href="./">&nbsp;&nbsp;Txn&nbsp;&nbsp;</a>
            </div>

            {/*
            DEBUGGING
            
            ({props.expiryTimestamp*1000})
            <br></br>
            {Date.now()}
            */}
            
          </div>
        </div>
      </div>
    </>
  )
}
