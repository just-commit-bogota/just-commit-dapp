import React, {useState}  from 'react'
import classNames from 'classnames'
import abi from "../contracts/CommitManager.json";
import CommitCardTimestamp from './CommitCardTimestamp'
import CardStatus from './CardStatus'
import CardButton from './CardButton'

import Modal from 'react-modal'

import {Web3Storage} from 'web3.storage'
import { useAccount, useNetwork, useProvider } from 'wagmi'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'


const contractAddress = "0x28D691d5eDFf71b72B8CA60EDcB164308945707F"
const web3StorageToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGRjZUFhYmMxRjk0NTk2QjUzOEYyYTI2ZWY2NzE4NjBkNjJiOTU5OWIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUxOTY1NDM3NjgsIm5hbWUiOiJqdXN0Y29tbWl0LWJvZ290YS10ZXN0In0.VBR4b-l96dOX0clFkvgx_FT40Jtoa2CFeq6cHUMM4uI";
// Construct with token and endpoint
const client = new Web3Storage({ token: web3StorageToken})    


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
    const [proofIpfsHash, setProofIpfsHash] = useState(props.ipfsHash);

    // smart contract data 
    const provider = useProvider()
    const { chain, chains } = useNetwork()
    const { address: isConnected } = useAccount()

    const { config } = usePrepareContractWrite({
        addressOrName: contractAddress,
        contractInterface: abi.abi,
        functionName: "proveCommit",
        args: [props.id, proofIpfsHash ]

    })
    const { data, isLoading, isSuccess, write } = useContractWrite(config)

    const { config: verifyConfig } = usePrepareContractWrite({
        addressOrName: contractAddress,
        contractInterface: abi.abi,
        functionName: "judgeCommit",
        args: [props.id, true]

    })
    const { write: verifyWrite } = useContractWrite(verifyConfig)

    const uploadFile = () => { 
      const fileInput = document.querySelector('input[type=file]');
      if (fileInput.files.length > 0) {
        console.log(client)
        console.log(fileInput)
        client.put(fileInput.files, {
            name: 'cat pics',
            maxRetries: 3,
        }).then(cid => {
          setProofIpfsHash(cid);
          // write to updateCommit here
          if (write) {
            write();
          }
        });
      }
   
    }

    const verifyProof = () => { 
        verifyWrite();
    }



    let subtitle;
    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [verifyModalIsOpen, setVerifyIsOpen] = React.useState(false);

    function openModal() {
        console.log('openuploadmodal')
        setIsOpen(true);
    }

    function openVerifyModal() {
        console.log('openverifymodal')
        setVerifyIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

    function closeVerifyModal() {
        setVerifyIsOpen(false);
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
                    <CardButton onClick={buttonType =='Upload' ? openModal : openVerifyModal} type={buttonType}></CardButton>
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
                        <div className='upload__modal__box'>
                            <div className="upload__modal__desc">
                                <img className="upload__modal__icon" src='../static/icons/picture.svg'></img>
                                <span className='upload__modal__box-text'>Select an image file to upload</span>
                                <input type="file" id="proof" name="proof" />
                                {proofIpfsHash}
                                <button onClick={uploadFile}>upload</button>
                            </div>
                        </div>
                    </Modal>

                    <Modal
                        isOpen={verifyModalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeVerifyModal}
                        style={customStyles}
                        contentLabel="Verify Modal"
                    >
                        <div className='flex flex-row'>
                            <h2 className='upload__modal__heading' ref={(_subtitle) => (subtitle = _subtitle)}>Verify Proof</h2>
                            <div className='spacer'></div>
                            <button onClick={closeVerifyModal}>X</button>
                        </div>
                        <div className='upload__modal__box'>
                            <div className="upload__modal__desc">
                                <a href={"https://ipfs.io/ipfs/"+ proofIpfsHash}>{"https://ipfs.io/ipfs/"+ proofIpfsHash}</a>
                                <button onClick={verifyProof}>verify</button>
                            </div>
                        </div>
                    </Modal>
                </div>
                

            </div>
    </div>
}

export default CommitCard;

