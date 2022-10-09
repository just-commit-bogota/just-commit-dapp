import React  from 'react'
import classNames from 'classnames'
import CommitCardTimestamp from './CommitCardTimestamp'
import CardStatus from './CardStatus'
import CardButton from './CardButton'
import Modal from 'react-modal'
import { Box } from '@mui/material'

const customStyles = {
    content: {
      flexDirection: 'column',
      alignItems: 'center',
      padding: "21px 40px",

      width: "598px",
      height: "248px",

      background: "#FFFFFF",
      borderRadius: "16px",
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

Modal.setAppElement('#__next');

const CommitCard = (props) => {
    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        console.log('openmodal')
        setIsOpen(true);
    }

    function uploadFile(){

    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    function closeModal() {
    setIsOpen(false);
    }
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
                <div className='infoRight__button'>
                    <CardButton onClick={openModal} type={buttonType}></CardButton>
                    <Modal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        style={customStyles}
                        contentLabel="Upload Modal"
                    >
                        <div className='flex flex-row'>
                            <h2 className='upload__modal__heading' ref={(_subtitle) => (subtitle = _subtitle)}>Upload Image</h2>
                            <div className='spacer'></div>
                            <button onClick={closeModal}>X</button>
                        </div>
                        <form>
                        <input />
                        <Box onClick={uploadFile} className='upload__modal__box'>
                            <div className="upload__modal__desc">
                                <img className="upload__modal__icon" src='../static/icons/picture.svg'></img>
                                <span className='upload__modal__box-text'>Select an image file to upload</span>
                            </div>
                        </Box>

                        </form>
                    </Modal>
                </div>
                

            </div>
    </div>
}

export default CommitCard;

