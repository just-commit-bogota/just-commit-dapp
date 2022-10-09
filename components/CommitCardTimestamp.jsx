import React  from 'react';
import styled from 'styled-components';
import Countdown from 'react-countdown';
import moment from 'moment/moment';



// timeStamp is the only timestamp that should exist
// just check if timestamp exists in the future or if is in the past
// show countdown instead of date if in the future
const CommitCardTimestamp = (props) => {

    return <>
        {props.timeStamp*1000 > Date.now() ? <Countdown date={props.timeStamp*1000}></Countdown> : moment(props.timeStamp*1000).fromNow()   }
    </>


    
}

export default CommitCardTimestamp;