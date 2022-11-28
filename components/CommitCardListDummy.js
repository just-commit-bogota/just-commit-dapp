import Button from '@mui/material/Button'
import { useEffect, useState } from "react"
import CommitCard from "./CommitCard.js"
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'

export default function CommitCardListDummy() {

  // a dummy card list
  
  const cardList = [
    {
      id: '0',
      status: 'Active',
      userIsCreator: false,
      userIsCommitee: false,
      expiryTimestamp: '0000',
      commitFrom: 'belf.eth',
      commitTo: 'vitalik.eth',
      stakeAmount: '20 USDC',
      createdTimestamp: '1111',
      message: 'go to the gym today',
      ipfsHash: 'hi',
      txnHash: 'hi',
    }
  ]
  
  // state
  const [selectedFilter, setSelectedFilter] = useState("Feed")
  const connectedAddress = true // { address: connectedAddress } = useAccount()

  // variables
  const filters_left = ["Active", "Waiting", "Verify"]
  const filters_right = ["My History", "Feed"]
  const cardListToDisplay =
    // Feed: Failure or Success
    selectedFilter == "Feed" ?
      cardList.filter(c => (c.status == "Failure" || c.status == "Success")) :
    // My History: connectedAddress is commitFrom and Failure or Success
    selectedFilter == "My History" ?
      cardList.filter(c => (c.commitFrom == connectedAddress &&
                           (c.status == "Failure" || c.status == "Success"))) :
    // Verify: connectedAddress is commitTo and Waiting
    selectedFilter == "Verify" ?
      cardList.filter(c => (c.commitTo == connectedAddress && c.status == "Waiting")) :
    // Waiting: connectedAddress is commitFrom and Waiting
    selectedFilter == "Waiting" ? 
      cardList.filter(c => (c.commitFrom == connectedAddress && c.status == "Waiting")) :
    // Active: connectedAddress is commitFrom and Pending
    cardList.filter(c => (c.commitFrom == connectedAddress && c.status == "Pending"))

  // useEffect()
  // set Active filter to active
  useEffect(()=>{
    setSelectedFilter("Active")
    const element = document.getElementById("Active");
    element.classList.add("active");
  }, [])

  // functions
  const onCategoryClick = (filter) =>
  {
    const oldFilter = selectedFilter
    if (filter != oldFilter) {
      const oldSelected = document.getElementById(oldFilter);
      oldSelected.classList.toggle("active");
      setSelectedFilter(filter);
      const newSelected = document.getElementById(filter);
      newSelected.classList.toggle("active");
    }   
  }

	return (
    <>
      <div className = "flex w-11/12 justify-center gap-2 lg:gap-16 text-small mt-4 mb-10">
        <ul className="flex flex-row continent_nav">
          {filters_left.map(f => 
          <li key={f} id={f} className="filterOption">
            <a onClick={() => onCategoryClick(f)}>{f}</a>
          </li>)}
        </ul>
        <ul className="flex flex-row continent_nav">
          {filters_right.map(f => 
          <li key={f} id={f} className="filterOption"
            style = {{borderColor: "rgba(29, 180, 151, .5)"}}>
            <a onClick={() => onCategoryClick(f)}>{f}</a>
          </li>)}
        </ul>
      </div>
  
      <div className = "w-11/12">
        {cardListToDisplay.map((card, index) => (
          <CommitCard
            key={card.id}
            status={card.status}
            expiryTimestamp={card.expiryTimestamp}
            commitFrom={card.commitFrom}
            commitTo={card.commitTo}
            stakeAmount={ethers.utils.formatEther(card.stakeAmount)}
            createdTimestamp={card.createdTimestamp}
            message={card.message}
            userIsCreator={card.userIsCreator}
            userIsCommitee={card.userIsCommitee}
            ipfsHash={card.ipfsHash}
            id={card.id}
          />
        )).reverse()}
      </div>
    </>
  )
}

{/* A COMMIT FORMATTING

  <div className="border-solid border-2 border-neutral-600/20 bg-white p-4 rounded-md mb-10 shadow-md">
    <div className="flex flex-row" style = {{justifyContent: "space-between"}}>
      <div className="w-4/5 text-sm block">100 push-ups</div>
      <div className="flex align-left space-x-2">
        <div className="text-sm text-slate-400 opacity-80">7h ago</div>
      </div>
    </div>
    <br></br>
    <img style={{margin:"0 -8px", maxWidth:"105%", borderRadius:"6px"}} src="./dummy-pic-5.png" />
    <div className="flex flex-row text-xs pt-4" style={{justifyContent: "space-between"}}>
      <div className="flex flex-col w-1/2" style={{
        justifyContent: "space-between",
        borderLeft:"2px solid rgba(0, 0, 0, 0.18)",
        borderRight:"2px solid rgba(0, 0, 0, 0.18)",
        borderRadius: "6px",
      }}>
        <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>&nbsp;From </b>belf.eth&nbsp;</div>
        <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>&nbsp;To </b>justcommit.eth&nbsp;</div>
      </div>
      <div className="flex flex-row w-1/6 align-center justify-center"
           style={{border:"2px solid rgba(50, 50, 50, .5)", borderRadius: "10px"}}>
        <div className="flex flex-col align-center justify-center">
          <img className="h-4" src="./usdc-logo.png" />
        </div>
        <div className="flex flex-col font-semibold align-center justify-center text-xs">&nbsp;20</div>
      </div>
      <div className="flex flex-col align-center justify-center text-lg">✅</div>
      <div className="flex flex-col w-1/10 font-medium align-center justify-center text-blue-600 text-xs rounded-lg bg-sky-200 hover:bg-sky-400">
        <a href="./">&nbsp;&nbsp;Txn&nbsp;&nbsp;</a>
      </div>
    </div>
  </div>

*/}

{/* HELPER FUNCTIONS

// function formatDate(timestamp) {
// 	return dayjs(timestamp).format("MMM D, YYYY");
// }

// function formatTime(timestamp) {
// 	return dayjs(timestamp).format("h:mm:ss a");
// }

*/}