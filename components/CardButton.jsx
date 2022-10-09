import React from "react";
import UploadButton from "./UploadButton";
import VerifyButton from "./VerifyButton";


export default function CardButton(props) {
  let button;
  if (props.type == 'Upload'){
    button = <UploadButton onClick={props.onClick}></UploadButton>
  } else if (props.type =='Verify') {
    button = <VerifyButton onClick={props.onClick}></VerifyButton>
  }
  return (
    button
  );
}