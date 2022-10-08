import React from "react";
import classNames from "classnames";


export default function CardButton(props) {
    const button = <button hidden={props.type == 'none'} className="card__button">{props.type}</button>;
  return (
    button
  );
}