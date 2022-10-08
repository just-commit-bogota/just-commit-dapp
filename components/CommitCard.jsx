import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import CommitCardTimestamp from './CommitCardTimestamp'
import Status from './Status'

const StyledBorder = styled.div`
    // background: linear-gradient(93.2deg, rgba(243, 221, 233, 0.02) 0%, rgba(243, 221, 233, 0.27) 100%), 
    // #FFFFFF;
    // border: 2px solid #F3DDE9;

`

// refactor this
const VerifyButton = styled.button`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px 16px;
    gap: 10px;

    width: 81px;
    height: 44px;

    /* vi_green/green_default */
    background: #1DD297;
    border-radius: 8px;
    color: white;
`

const CommitCard = (props) => {

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
                    <h2 className='card__heading m-4'>Reading</h2>
                    <Status status={props.status}></Status>
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
                <div className='infoRight__button'><VerifyButton>Verify</VerifyButton></div>

            </div>
    </div>
}

export default CommitCard;

