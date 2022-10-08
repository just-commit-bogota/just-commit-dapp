import React  from 'react';
import styled from 'styled-components';
import Countdown from 'react-countdown';



// timeStamp is the only timestamp that should exist
// just check if timestamp exists in the future or if is in the past
// show countdown instead of date if in the future
const CommitCardTimestamp = (props) => {

    console.log(props.timeStamp*1000)
    console.log(Date.now())
    return <>
        {props.timestamp*1000 > Date.now() ? props.timeStamp : <Countdown date={props.timeStamp*1000}></Countdown> }
    </>


    
}

export default CommitCardTimestamp;