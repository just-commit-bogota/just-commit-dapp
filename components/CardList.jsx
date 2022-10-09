import React  from 'react'
import classNames from 'classnames'
import CommitCard from "./CommitCard"
import {ethers} from 'ethers'

// this component displays all the commitment cards in a sorted list
// based on expiry time and urgency
export default function CardList({ cardList }) {
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
				/>
			)).reverse()}
		</div>
	);
}