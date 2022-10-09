import React from "react";
import classNames from "classnames";



export default function CardStatus(props) {
  return (
    <div className={classNames({
        'card__status-success': props.status == 'Success',
        'card__status-waiting': props.status == 'Waiting',
        'card__status-failure': props.status == 'Failure',
        'card__status-pending': props.status == 'Pending',

    }) + " card__status"}>
        <div className={classNames({
            'card__status-success__text': props.status == 'Success',
            'card__status-waiting__text': props.status == 'Waiting',
            'card__status-failure__text': props.status == 'Failure',
            'card__status-pending__text': props.status == 'Pending',
        }) + " card__status__text"}>
            {props.status}
        </div>
    </div>
  );
}