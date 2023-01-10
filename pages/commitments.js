import Head from 'next/head'
import Link from 'next/link'
import Header from "../components/Header.js"
import CommitCardList from "../components/CommitCardList.js"
import { Placeholders } from "../components/Placeholders.js"
import { useState, useEffect } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import abi from "../contracts/CommitManager.json"
import { useStorage } from '../hooks/useLocalStorage.ts';

export default function Commitments() {

  useEffect(() => {
    setTimeout(() => {
      buildCommitArray()
      setLoadingState('loaded')
    });
  }, []);

  // hard-coded
  const CONTRACT_ADDRESS = "0xa8db83b92e56bac174e71283104176d4368092d9"

  // variables
  const { getItem } = useStorage();
  const txnHash = getItem('txnHash');

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

      // classify into one of four statuses
      let status = "Failure";
      console.log("FAILURE")
      if (commit.commitJudged) { // TODO: does not take into account actual "approve" or "deny" response
        status = "Success";
        console.log("SUCCESS")
      } else if (commit.validThrough > Date.now() && commit.ipfsHash == "") {
        status = "Pending";
        console.log("PENDING")
      } else if (commit.validThrough > Date.now() && commit.ipfsHash != "") {
        status = "Waiting";
        console.log("WAITING")
      }

      // from start contract
      newCommitStruct.id = commit.id.toNumber();
      newCommitStruct.commitFrom = commit.commitFrom;
      newCommitStruct.commitTo = commit.commitTo;
      newCommitStruct.createdAt = commit.createdAt.toNumber();
      newCommitStruct.validThrough = commit.validThrough.toNumber();
      newCommitStruct.judgeDeadline = commit.judgeDeadline;
      newCommitStruct.stakeAmount = commit.stakeAmount;
      newCommitStruct.message = commit.message;
      newCommitStruct.ipfsHash = commit.ipfsHash;
      newCommitStruct.commitJudged = commit.commitJudged;
      newCommitStruct.isApproved = commit.isApproved;

      // front-end only
      newCommitStruct.status = status;
      newCommitStruct.userIsCreator = commit.commitFrom == address;
      newCommitStruct.userIsJudge = commit.commitTo == address;
      newCommitStruct.txnHash = txnHash;

      newArray.push(newCommitStruct);

      console.log(newCommitStruct);

      // ----------

      // DEBUGGING

      // console.log("validThrough: " + commit.validThrough)
      // console.log("ipfsHash: " + commit.ipfsHash)
      // console.log("Date.now(): " + Date.now())

      // END OF DEBUGGING

      // ----------

    }

    newArray.sort((a, b) => (a.validThrough > b.validThrough) ? 1 : -1)
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

      <Header dropdownLabel="&emsp;Commitments&emsp;" />

      <div className="flex">
        <div className="w-8/10 sm:w-1/2 mx-auto p-0 lg:p-10 mt-20">
          <div className="flex flex-col justify-center items-center">
            {
              loadingState === 'loading' && <Placeholders loadingStyle="commitmentsLoadingStyle" number={6} />
            }
            {
              loadingState === 'loaded' && <CommitCardList cardList={commitArray} />
            }
          </div>

        </div>
      </div>
    </>
  )
}
