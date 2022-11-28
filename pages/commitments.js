import Head from 'next/head'
import Link from 'next/link'
import Header from "../components/Header.js"
import CommitCardListDummy from "../components/CommitCardListDummy.js"
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
    }, 1000);
  }, []);

  // state
  const [loadingState, setLoadingState] = useState('loading')
  const [commitArray, setCommitArray] = useState([])
  const { address: isConnected } = useAccount()

  // smart contract
  const contractAddress = "0x33CaC3508c9e3C50F1ae08247C79a8Ed64ad82a3"
  const { data: commitData, isError, isLoading: commitIsLoading } = useContractRead({
    addressOrName: contractAddress,
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
      
      let status = "Failure";
      if (commit.commitJudged) {
        status = "Success";
      } else if ( commit.expiryTimestamp*1000 > Date.now() && commit.proofIpfsHash == "" ) {
        status = "Pending";
      } else if ( commit.expiryTimestamp*1000 > Date.now() && commit.proofIpfsHash !== "" ) {
        status = "Waiting";
      }
      
      newCommitStruct.id = commit.id.toNumber();
      newCommitStruct.status = status;
      newCommitStruct.userIsCreator = commit.commitFrom == isConnected;
      newCommitStruct.userIsCommitee = commit.commitTo == isConnected;
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
    console.log(commitArray)
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
      
      <Header dropdownLabel = <Link href="commitments" color="green">&emsp;Commitments&emsp;</Link> color="green"/>

      <div className="flex">
        <div className= "w-8/10 sm:w-1/2 mx-auto p-0 lg:p-10 mt-20">
          <div className= "flex flex-col justify-center items-center">
            {
              loadingState === 'loading' && <Placeholders loadingStyle = "commitmentsLoadingStyle" number = {6} />
            }
            {
              loadingState === 'loaded' && 
                <CommitCardListDummy />
                // <CommitCardList cardList = {commitArray} />
            }
          </div>
        </div>
      </div>
    </>
  )
}

