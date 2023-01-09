import Head from 'next/head'
import Link from 'next/link'
import Header from "../components/Header.js"
import CommitCardList from "../components/CommitCardList.js"
import { Placeholders } from "../components/Placeholders.js"
import { useState, useEffect } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import abi from "../contracts/CommitManager.json"

export default function Commitments() {

  useEffect(() => {
    setTimeout(() => {
      buildCommitArray()
      setLoadingState('loaded')
    });
  }, []);

  // hard-coded
  const CONTRACT_ADDRESS = "0x33CaC3508c9e3C50F1ae08247C79a8Ed64ad82a3"

  // state
  const [loadingState, setLoadingState] = useState('loading')
  const [commitArray, setCommitArray] = useState([])
  const { address } = useAccount()

  // smart contract
  const { data: commitData, isError } = useContractRead({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abi.abi,
    functionName: "getAllCommits",
  })

  // functions
  function buildCommitArray() {
    if (!commitData) {
      return
    }

    let newArray = [];
    for (let commit of commitData) {
      let newCommitStruct = {}

      // classify into one of the four statuses
      // TODO: does not take into account actual "approve" or "deny" response
      let status = "Failure";
      console.log("Hello")
      if (commit.commitJudged) { // never gets here
        console.log("Hi")
        status = "Success";
      } else if (commit.expiryTimestamp > Date.now() && commit.proofIpfsHash == "") {
        status = "Pending";
      } else if (commit.expiryTimestamp > Date.now() && commit.proofIpfsHash != "") {
        status = "Waiting";
      }

      // DEBUGGING

      // console.log("expiryTimestamp: " + commit.expiryTimestamp)
      // console.log("proofIpfsHash: " + commit.proofIpfsHash)
      // console.log("Date.now(): " + Date.now())
      

      // END OF DEBUGGING
      
      newCommitStruct.id = commit.id.toNumber();
      newCommitStruct.status = status;
      newCommitStruct.userIsCreator = commit.commitFrom == address;
      newCommitStruct.userIsCommitee = commit.commitTo == address;
      newCommitStruct.expiryTimestamp = commit.expiryTimestamp.toNumber();
      newCommitStruct.commitFrom = commit.commitFrom;
      newCommitStruct.commitTo = commit.commitTo;
      newCommitStruct.stakeAmount = commit.stakeAmount;
      newCommitStruct.createdTimestamp = commit.createdTimestamp.toNumber();
      newCommitStruct.message = commit.message;
      newCommitStruct.ipfsHash = commit.proofIpfsHash;
      newCommitStruct.txnHash = commitData.hash;

      newArray.push(newCommitStruct);
    }

    newArray.sort((a, b) => (a.expiryTimestamp > b.expiryTimestamp) ? 1 : -1)
    setCommitArray(newArray);
  }
  
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
      
      <Header dropdownLabel = "&emsp;Commitments&emsp;" />

      <div className="flex">
        <div className= "w-8/10 sm:w-1/2 mx-auto p-0 lg:p-10 mt-20">
          <div className= "flex flex-col justify-center items-center">
            {
              loadingState === 'loading' && <Placeholders loadingStyle = "commitmentsLoadingStyle" number = {6} />
            }
            {
              loadingState === 'loaded' && <CommitCardList cardList = {commitArray} />
            }
          </div>
          
        </div>
      </div>
    </>
  )
}
