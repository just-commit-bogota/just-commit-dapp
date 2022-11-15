import React  from 'react'
import CommitCard from "./CommitCard.js"
import { ethers } from 'ethers'

export default function CommitCardList({ cardList }) {
	if (!cardList) {
		return null;
	}

	return (
    <div>
			{cardList.map((card) => (
				<CommitCard
					key={card.id}
          status={card.status}
          timeStamp={card.expiryTimestamp}
          commitFrom={card.commitFrom}
          commitTo={card.commitTo}
          stakeAmount={ethers.utils.formatEther(card.stakeAmount)}
          createdTimestamp="TODO"
          validPeriod="TODO"
					message={card.message}
					userIsCreator={card.userIsCreator}
					userIsCommitee={card.userIsCommitee}
					ipfsHash={card.ipfsHash}
					id={card.id}
				/>
			)).reverse()}
		</div>
	);
}
