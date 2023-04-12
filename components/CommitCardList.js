import { useEffect, useState } from "react"
import CommitCard from "./CommitCard.js"
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'
import { Tag, Typography } from '@ensdomains/thorin'
import { useStorage } from '../hooks/useStorage.ts'

// TODO - is the commitJudge.includes() logic done right?

export default function CommitCardList({ cardList }) {
  // state
  const [selectedFilter, setSelectedFilter] = useState("Feed")
  const { address: connectedAddress } = useAccount()

  // variables
  const { getItem, setItem, removeItem } = useStorage()
  const filters = ["Feed", "History", "Active", "Waiting", "Verify"]
  const cardListToDisplay =
    // Feed: Failure or Success
    selectedFilter == "Feed" ?
      cardList.filter(c => (c.status == "Failure" || c.status == "Success")) :
      // History: connectedAddress is commitFrom and Failure or Success
      selectedFilter == "History" ?
        cardList.filter(c => (c.commitFrom == connectedAddress &&
          (c.status == "Failure" || c.status == "Success"))) :
        // Verify: connectedAddress includes commitJudge and Waiting
        selectedFilter == "Verify" ?
          cardList.filter(c => (c.commitJudge.includes(connectedAddress) && c.status == "Waiting")) :
          // Waiting: connectedAddress is commitFrom and Waiting
          selectedFilter == "Waiting" ?
            cardList.filter(c => (c.commitFrom == connectedAddress && c.status == "Waiting")) :
            // Active: connectedAddress is commitFrom and Pending
            cardList.filter(c => (c.commitFrom == connectedAddress && c.status == "Pending"))

  const filterCounts = [
    { filter: "Verify", count: cardList.filter(c => (c.commitJudge.includes(connectedAddress) && c.status == "Waiting")).length },
    { filter: "Waiting", count: cardList.filter(c => (c.commitFrom == connectedAddress && c.status == "Waiting")).length },
    { filter: "Active", count: cardList.filter(c => (c.commitFrom == connectedAddress && c.status == "Pending")).length }
  ]

  // select the filter to active
  useEffect(() => {
    const savedFilter = localStorage.getItem("selectedFilter");
    if (savedFilter) {
      setSelectedFilter(savedFilter);
      const element = document.getElementById(savedFilter);
      element.classList.add("active");
    } else {
      setSelectedFilter("Feed");
      const element = document.getElementById("Feed");
      element.classList.add("active");
    }
  }, [])

  // functions
  const onFilterClick = (filter) => {
    const oldFilter = selectedFilter
    if (filter != oldFilter) {
      const oldSelected = document.getElementById(oldFilter);
      oldSelected.classList.toggle("active");
      setSelectedFilter(filter);
      localStorage.setItem("selectedFilter", filter);
      const newSelected = document.getElementById(filter);
      newSelected.classList.toggle("active");
    }
  }

  return (
    <>
      <div className="flex justify-center gap-2 lg:gap-16 text-small mt-4 mb-10">
        <ul className="flex flex-row continent_nav">
          {filters.map(f =>
            <li key={f} id={f} title={f} className="filterOption"
              style={{
                position: "relative",
                borderColor: (f == "Active" || f == "Waiting" || f == "Verify") ?
                  "rgba(18, 74, 56, .5)" : "rgba(53, 72, 98, 1)",
                borderWidth: "2px",
                cursor: "pointer"
              }}>
              <a onClick={() => onFilterClick(f)}>{f}</a>
              {/* Counter Badge */}
              {["Active", "Waiting", "Verify"].includes(f) && filterCounts.find(filterCount => filterCount.filter === f)?.count > 0 &&
                <Tag
                  className="hover:cursor-pointer"
                  size="small"
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-8px",
                    color: "rgba(255, 255, 255, 1)",
                    backgroundColor: f == "Waiting" ? "rgba(255, 201, 67, 1)" : "rgba(255, 90, 90, 1)"
                  }}
                >
                  {filterCounts.find(filterCount => filterCount.filter === f).count}
                </Tag>
              }
            </li>
          )}
        </ul>
      </div>

      <div className="w-full">
        {cardListToDisplay.length > 0 ? (
          <>
            {cardListToDisplay.map((card, index) =>
              card.id !== 0 ? ( // conditional temporarily added
                <CommitCard
                  key={index}
                  
                  status={card.status}
        
                  id={card.id}
                  commitFrom={card.commitFrom}
                  commitJudge={card.commitJudge}
                  createdAt={card.createdAt}
                  endsAt={card.endsAt}
                  judgeDeadline={card.judgeDeadline}
                  stakeAmount={ethers.utils.formatEther(card.stakeAmount)}
                  message={card.message}
                  filename={card.filename}
                  isCommitProved={card.isCommitProved}
                  isCommitJudged={card.isCommitJudged}
                  isApproved={card.isApproved}
                  isSolo={card.isSolo}
                />
              ) : null
            ).reverse()}
          </>
        ) : (
          <Typography weight="normal" variant="base" className="flex flex-row text-m block mt-6 text-black font-bold rounded-md p-3 lg:justify-center lg:align-center"
            style={{ justifyContent: "center" }}>
            Nothing to show.
          </Typography>
        )}
      </div>
    </>
  )
}
