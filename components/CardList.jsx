import React  from 'react'
import classNames from 'classnames'
import CommitCard from "./CommitCard"

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
                    key={wave.timestamp} 
                    address={wave.address}
                    timestamp={wave.timestamp}
                    message={wave.message}
				/>
			)).reverse()}
		</div>
	);
}