import Head from 'next/head'
import Header from "../components/Header.js"
import CommitCardList from "../components/CommitCardList.js"
import { Placeholders } from "../components/Placeholders.js"
import { useState, useEffect } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { CONTRACT_ADDRESS, ABI } from '../contracts/CommitManager.ts';
import PullToRefresh from 'react-simple-pull-to-refresh';

export default function Commitments() {

  useEffect(() => {
    buildCommitArray()
    setLoadingState("loaded");
  }, []);

  // state
  const { address } = useAccount()
  const [loadingState, setLoadingState] = useState('loading')
  const [commitArray, setCommitArray] = useState([])

  // smart contract
  const { data: commitData, isError } = useContractRead({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    functionName: "getAllCommits",
  })

  // functions
  function buildCommitArray() {
    console.log("building commit array")
    if (!commitData) {
      return
    }

    // build commit array
    let newArray = [];
    for (let commit of commitData) {
      let newCommitStruct = {}

      let status = "";

      // is valid and does not have a proof
      if (commit.validThrough > Date.now() && !commit.commitProved) {
        status = "Pending";
        console.log("PENDING")
      }
      // has not expired, has a proof, but has not been judged
      else if (commit.judgeDeadline > Date.now() && commit.commitProved && !commit.commitJudged) {
        status = "Waiting";
        console.log("WAITING")
      }
      // is approved or the commit expired and was proved
      else if (commit.isApproved || (commit.judgeDeadline < Date.now() && commit.commitProved)) {
        status = "Success";
        console.log("SUCCESS")
      }
      // commit has been denied or commit has expired
      else {
        status = "Failure";
        console.log("FAILURE")
      }

      // from start contract
      newCommitStruct.id = commit.id.toNumber();
      newCommitStruct.commitFrom = commit.commitFrom;
      newCommitStruct.commitTo = commit.commitTo;
      newCommitStruct.createdAt = commit.createdAt.toNumber();
      newCommitStruct.validThrough = commit.validThrough.toNumber();
      newCommitStruct.judgeDeadline = commit.judgeDeadline.toNumber();
      newCommitStruct.stakeAmount = commit.stakeAmount;
      newCommitStruct.message = commit.message;
      newCommitStruct.ipfsHash = commit.ipfsHash;
      newCommitStruct.filename = commit.filename;
      newCommitStruct.commitProved = commit.commitProved;
      newCommitStruct.commitJudged = commit.commitJudged;
      newCommitStruct.isApproved = commit.isApproved;

      // front-end only
      newCommitStruct.status = status;

      newArray.push(newCommitStruct);
      console.log("isApproved: " + newCommitStruct.isApproved);
      console.log(newCommitStruct)

      // ----------

      // DEBUGGING

      // console.log("validThrough: " + commit.validThrough)
      // console.log("ipfsHash: " + commit.ipfsHash)
      // console.log("Date.now(): " + Date.now())

      // END OF DEBUGGING

      // ----------

    }

    newArray.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
    setCommitArray(newArray);
    // setLoadingState('loaded')
    
    console.log(newArray);
  }

  return (
    <PullToRefresh onRefresh={() => {
      try {
        return location.reload()
      } catch (error) {
        return
      }
    }}>
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
  
        <Header dropdownLabel="&nbsp;Commitments&nbsp;" />
  
        <div className="flex h-screen">
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
    </PullToRefresh>
  );
}
