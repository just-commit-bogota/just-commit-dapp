export default function Commit() {
  return (
    <>
      <div className="commitbox">
        <div>Stretching exercises</div>
        <br></br>
        <div style={{fontSize: "small"}}>
          <div><b>From: </b>belf.eth</div>
          <div><b>To: </b>justcommit.eth</div>
          <div><b>Amount: </b>20 USDC</div>
          <div><b>Success? </b>✅</div>
          <div><b>Timestamp: </b>Nov 8, 2022 at 5:51 PM</div>
        </div>
        <br></br>
        <div className="flex justify-center">
          <img src="./dummy-pic.png" />
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