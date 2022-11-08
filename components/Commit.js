export default function Commit() {
  return (
    <>
      <div className="commitbox">
        <div>This is a dummy commit</div>
        <br></br>
        <div style={{fontSize: "small"}}>
          <div><b>From: </b>belf.eth</div>
          <div><b>To: </b>justcommit.eth</div>
          <br></br>
          <div><b>Amount: </b>20 USDC</div>
          <div><b>Success? </b>✅</div>
          <div><b>Timestamp: </b>Nov 8, 2022 at 5:51 PM</div>
        </div>
      </div>
    </>
  )
}

// function formatDate(timestamp) {
// 	return dayjs(timestamp).format("MMM D, YYYY");
// }

// function formatTime(timestamp) {
// 	return dayjs(timestamp).format("h:mm:ss a");
// }