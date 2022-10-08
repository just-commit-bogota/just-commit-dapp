import React from 'react'
import styled from 'styled-components'
import { isConstructorDeclaration } from 'typescript'
import styles from '../styles/CommitCard.module.css'
import CommitCardTimestamp from './CommitCardTimestamp'

const StyledBorder = styled.div`
    background: linear-gradient(93.2deg, rgba(243, 221, 233, 0.02) 0%, rgba(243, 221, 233, 0.27) 100%), 
    #FFFFFF;
    border: 2px solid #F3DDE9;
    border-radius: 16px;
    width: 400px;
    height: 300px;
    margin: 0 auto;
    margin-bottom: 30px;

    box-sizing: border-box;

    /* Auto layout */
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: start;
    padding: 48px;

    width: 70%;
    height: 341px;
`

const Status = styled.div`
    display: flex;
    width: 73px;
    height: 33px;

    background: #F3DDE9;
    border-radius: 28px;
    align-items: center;
    justify-content: center;
`

const StatusText = styled.div`
font-weight: 7vj00;
font-size: 16px;
line-height: 19px;

color: #937C88;
text-align: center;
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

    return <StyledBorder>
            <div className='infoLeft'>
                <div className='infoLeft__heading'>
                    <img className='card__logo mr-2' src="../static/icons/workout.svg"></img>
                    <h2 className='card__heading m-4'>Reading</h2>
                    <Status><StatusText>Failed</StatusText></Status>
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
    </StyledBorder>
}

export default CommitCard;

