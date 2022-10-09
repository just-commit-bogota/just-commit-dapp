import React  from 'react'
import classNames from 'classnames'
import CommitCardTimestamp from './CommitCardTimestamp'
import CardStatus from './CardStatus'
import CardButton from './CardButton'


const CommitCard = (props) => {
    let buttonType = 'none';
    if (props.status == "Pending"){
        buttonType = "Upload"
    } else if (props.status == "Waiting" && !props.userIsCreator) {
        buttonType = "Verify"
    } else if (props.status == "Failure" && props.userIsCommitee) {
        buttonType = "Claim"
    }

    // initialize type state
    return <div className={classNames({
        'styledBorder': true,
        'styledBorder--waiting': props.status == "Waiting",
        'styledBorder--success': props.status == "Success",
        'styledBorder--failure': props.status == "Failure",
        'styledBorder--pending': props.status == "Pending",

    })}>
            <div className='infoLeft'>
                <div className='infoLeft__heading'>
                    <img className='card__logo mr-2' src="../static/icons/workout.svg"></img>
                    <h2 className='card__heading m-4'>{props.message}</h2>
                    <CardStatus status={props.status}></CardStatus>
                </div> 
                <div className='infoLeft_description'>
                    <div className='infoLeft__description--line'>  Created by: {props.commitFrom} </div>
                    <div className='infoLeft__description--line'>  Commited to: {props.commitTo} </div>
                    <div className='infoLeft__description--line'>  Amount: {props.stakeAmount} ETH </div>
                    <div className='infoLeft__description--line'>  Created Time: {props.createdTimestamp} </div>
                    <div className='infoLeft__description--line'>  Valid Period: {props.validPeriod} </div>

                </div>

            </div>
            <div className='infoRight'>
                <div className='infoRight__timestamp'><CommitCardTimestamp timeStamp={props.timeStamp}></CommitCardTimestamp></div>
                <div className='infoRight__spacer'></div>
                <div className='infoRight__button'><CardButton type={buttonType}></CardButton></div>

            </div>
    </div>
}

export default CommitCard;

