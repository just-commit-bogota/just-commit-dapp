import { useEffect, useState } from "react"
import CommitCard from "./CommitCard.js"
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'

export default function CommitCardList({ cardList }) {
  // state
  const [selectedFilter, setSelectedFilter] = useState("Feed")
  const { address: connectedAddress } = useAccount()

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

  // set Active filter to active
  useEffect(() => {
    setSelectedFilter("Active")
    const element = document.getElementById("Active");
    element.classList.add("active");
  }, [])

  // functions
  const onCategoryClick = (filter) => {
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
      <div className="flex w-11/12 justify-center gap-2 lg:gap-16 text-small mt-4 mb-10">
        <ul className="flex flex-row continent_nav">
          {filters_left.map(f =>
            <li key={f} id={f} className="filterOption">
              <a onClick={() => onCategoryClick(f)}>{f}</a>
            </li>)}
        </ul>
        <ul className="flex flex-row continent_nav">
          {filters_right.map(f =>
            <li key={f} id={f} className="filterOption"
              style={{ borderColor: "rgba(29, 180, 151, .5)" }}>
              <a onClick={() => onCategoryClick(f)}>{f}</a>
            </li>)}
        </ul>
      </div>

      <div className="w-11/12">
        {cardListToDisplay.map((card, index) => (
          <CommitCard
            key={index}

            id={card.id}
            commitFrom={card.commitFrom}
            commitTo={card.commitTo}
            createdAt={card.createdAt}
            validThrough={card.validThrough}
            judgeDeadline={card.judgeDeadline}
            stakeAmount={ethers.utils.formatEther(card.stakeAmount)}
            message={card.message}
            ipfsHash={card.ipfsHash}
            commitProved={card.commitProved}
            commitJudged={card.commitJudged}
            isApproved={card.isApproved}

            status={card.status}
          />
        )).reverse()}
      </div>
    </>
  )
}