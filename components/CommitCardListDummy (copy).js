import Button from '@mui/material/Button'

export default function CommitCardListDummy() {
  return (
    <>
      <div className="border-solid border-2 border-neutral-600/20 bg-white p-4 rounded-md mb-10 shadow-md">
        <div className="flex flex-row" style = {{justifyContent: "space-between"}}>
          <div className="w-4/5 text-sm block">Stretching exercises</div>
          <div className="flex align-left space-x-2">
            <div className="text-sm text-slate-400 opacity-80">5h ago</div>
          </div>
        </div>
        <br></br>
        <img style={{margin:"0 -8px", maxWidth:"105%", borderRadius:"6px"}} src="./dummy-pic-1.png" />
        <div className="flex flex-row text-xs pt-4" style={{justifyContent: "space-between"}}>
          <div className="flex flex-col w-1/2" style={{
            justifyContent: "space-between",
            borderLeft:"2px solid rgba(0, 0, 0, 0.18)",
            borderRight:"2px solid rgba(0, 0, 0, 0.18)",
            borderRadius: "6px",
          }}>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>&nbsp;From </b>belf.eth&nbsp;</div>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>&nbsp;To </b>justcommit.eth&nbsp;</div>
          </div>
          <div className="flex flex-row w-1/6 align-center justify-center"
               style={{border:"2px solid rgba(50, 50, 50, .5)", borderRadius: "10px"}}>
            <div className="flex flex-col align-center justify-center">
              <img className="h-4" src="./usdc-logo.png" />
            </div>
            <div className="flex flex-col font-semibold align-center justify-center text-xs">&nbsp;20</div>
          </div>
          <div className="flex flex-col align-center justify-center text-lg">✅</div>
          <div className="flex flex-col w-1/10 font-medium align-center justify-center text-blue-600 text-xs rounded-lg bg-sky-200 hover:bg-sky-400">
            <a href="./">&nbsp;&nbsp;Txn&nbsp;&nbsp;</a>
          </div>
        </div>
      </div>

      {/* SECOND COMMIT */}

      <div className="border-solid border-2 border-neutral-600/20 bg-white p-4 rounded-md mb-10 shadow-md">
        <div className="flex flex-row" style = {{justifyContent: "space-between"}}>
          <div className="w-4/5 text-sm block">100 push-ups</div>
          <div className="flex align-left space-x-2">
            <div className="text-sm text-slate-400 opacity-80">7h ago</div>
          </div>
        </div>
        <br></br>
        <img style={{margin:"0 -8px", maxWidth:"105%", borderRadius:"6px"}} src="./dummy-pic-5.png" />
        <div className="flex flex-row text-xs pt-4" style={{justifyContent: "space-between"}}>
          <div className="flex flex-col w-1/2" style={{
            justifyContent: "space-between",
            borderLeft:"2px solid rgba(0, 0, 0, 0.18)",
            borderRight:"2px solid rgba(0, 0, 0, 0.18)",
            borderRadius: "6px",
          }}>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>&nbsp;From </b>belf.eth&nbsp;</div>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>&nbsp;To </b>justcommit.eth&nbsp;</div>
          </div>
          <div className="flex flex-row w-1/6 align-center justify-center"
               style={{border:"2px solid rgba(50, 50, 50, .5)", borderRadius: "10px"}}>
            <div className="flex flex-col align-center justify-center">
              <img className="h-4" src="./usdc-logo.png" />
            </div>
            <div className="flex flex-col font-semibold align-center justify-center text-xs">&nbsp;20</div>
          </div>
          <div className="flex flex-col align-center justify-center text-lg">✅</div>
          <div className="flex flex-col w-1/10 font-medium align-center justify-center text-blue-600 text-xs rounded-lg bg-sky-200 hover:bg-sky-400">
            <a href="./">&nbsp;&nbsp;Txn&nbsp;&nbsp;</a>
          </div>
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
