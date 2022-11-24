import { useEffect, useState } from "react"
import CommitCard from "./CommitCard.js"
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'

export default function CommitCardList({cardList}) {
  // state
  const [selectedFilter, setSelectedFilter] = useState("Feed")
  const { address: connectedAddress } = useAccount()

  // variables
  const filters = ["Active", "Waiting", "Verify", "My History", "Feed"]
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
      <div className="flex flex-col lg:block"
           style={{alignItems: "center"}}>
        {/*lg:justify-center lg:space-x-10 */}
        <ul className="continent_nav text-small mt-4 mb-10">
          {filters.map(f => 
          <li key={f} id={f} className="filterOption" >
            <a onClick={() => onCategoryClick(f)}>{f}</a>
          </li>)}
        </ul>
    
        <div style = {{width: "90%"}}>
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
      </div>
    </>
  )
}
