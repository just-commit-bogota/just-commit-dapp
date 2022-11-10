import Button from '@mui/material/Button'

export default function Commit() {
  return (
    <>

      {/* THIS IS ONE PIC */}
      
      <div className="border-solid border-2 border-neutral-600/20 bg-white p-4 rounded-md mb-10 shadow-md">
        <div className="flex flex-row" style = {{justifyContent: "space-between"}}>
          <div className="w-1/2 text-sm block">Stretching exercises</div>
          <div className="flex align-left space-x-2">
            <div className="text-slate-400 opacity-80">5h ago</div>
          </div>
        </div>
        <br></br>
        <img style={{margin:"0 -8px", maxWidth:"105%", borderRadius:"6px"}} src="./dummy-pic-1.png" />
        <div className="flex flex-row text-xs pt-2" style={{justifyContent: "space-between"}}>
          <div className="flex flex-col w-2/5" style={{justifyContent: "space-between"}}>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>From </b>belf.eth</div>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>To </b>justcommit.eth</div>
          </div>
          <div className="flex flex-row w-1/5 align-center justify-center"
               style={{border:"1px solid rgba(50, 50, 50, .5)", borderRadius: "6px"}}>
            <div className="flex flex-col align-center justify-center">
              <img className="h-5" src="./usdc-logo.png" />
            </div>
            <div className="flex flex-col font-semibold align-center justify-center text-xs">&nbsp;20</div>
          </div>
          <div className="flex flex-col align-center justify-center text-lg">✅</div>
          <div className="flex flex-col w-1/10 font-medium align-center justify-center text-blue-600 text-xs underline-offset-4 hover:scale-105"
            style={{textDecoration: "underline"}}>
            Txn
          </div>
        </div>
      </div>

      {/* THIS IS ONE PIC */}
      
      <div className="border-solid border-2 border-neutral-600/20 bg-white p-4 rounded-md mb-10 shadow-md">
        <div className="flex flex-row" style = {{justifyContent: "space-between"}}>
          <div className="w-1/2 text-sm contents">hike El Avila this afternoon</div>
          <div className="flex align-left space-x-2">
            <div className="text-slate-400 opacity-80">7h ago</div>
          </div>
        </div>
        <br></br>
        <img style={{margin:"0 -8px", maxWidth:"105%", borderRadius:"6px"}} src="./dummy-pic-2.png" />
        <div className="flex flex-row text-xs pt-2" style={{justifyContent: "space-between"}}>
          <div className="flex flex-col w-2/5" style={{justifyContent: "space-between"}}>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>From </b>belf.eth</div>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>To </b>vitalik.eth</div>
          </div>
          <div className="flex flex-row w-1/5 align-center justify-center"
               style={{border:"1px solid rgba(50, 50, 50, .5)", borderRadius: "6px"}}>
            <div className="flex flex-col align-center justify-center">
              <img className="h-5" src="./usdc-logo.png" />
            </div>
            <div className="flex flex-col font-semibold align-center justify-center text-xs">&nbsp;10</div>
          </div>
          <div className="flex flex-col align-center justify-center text-lg">✅</div>
          <div className="flex flex-col w-1/10 font-medium align-center justify-center text-blue-600 text-xs underline-offset-4 hover:scale-105"
            style={{textDecoration: "underline"}}>
            Txn
          </div>
        </div>
      </div>

      {/* THIS IS ONE PIC */}
      
      <div className="border-solid border-2 border-neutral-600/20 bg-white p-4 rounded-md mb-10 shadow-md">
        <div className="flex flex-row" style = {{justifyContent: "space-between"}}>
          <div className="w-1/2 text-sm contents">Ice bath! 🧊</div>
          <div className="flex align-left space-x-2">
            <div className="text-slate-400 opacity-80">12h ago</div>
          </div>
        </div>
        <br></br>
        <img style={{margin:"0 -8px", maxWidth:"105%", borderRadius:"6px"}} src="./dummy-pic-3.png" />
        <div className="flex flex-row text-xs pt-2" style={{justifyContent: "space-between"}}>
          <div className="flex flex-col w-2/5" style={{justifyContent: "space-between"}}>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>From </b>belf.eth</div>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>To </b>gregskril.eth</div>
          </div>
          <div className="flex flex-row w-1/5 align-center justify-center"
               style={{border:"1px solid rgba(50, 50, 50, .5)", borderRadius: "6px"}}>
            <div className="flex flex-col align-center justify-center">
              <img className="h-5" src="./usdc-logo.png" />
            </div>
            <div className="flex flex-col font-semibold align-center justify-center text-xs">&nbsp;1000</div>
          </div>
          <div className="flex flex-col align-center justify-center text-lg">✅</div>
          <div className="flex flex-col w-1/10 font-medium align-center justify-center text-blue-600 text-xs underline-offset-4 hover:scale-105"
            style={{textDecoration: "underline"}}>
            Txn
          </div>
        </div>
      </div>

      {/* THIS IS ONE PIC */}
      
      <div className="border-solid border-2 border-neutral-600/20 bg-white p-4 rounded-md mb-10 shadow-md">
        <div className="flex flex-row" style = {{justifyContent: "space-between"}}>
          <div className="w-1/2 text-sm contents">Add a dropdown to dApp</div>
          <div className="flex align-left space-x-2">
            <div className="text-slate-400 opacity-80">1d ago</div>
          </div>
        </div>
        <br></br>
        <img style={{margin:"0 -8px", maxWidth:"105%", borderRadius:"6px"}} src="./dummy-pic-4.png" />
        <div className="flex flex-row text-xs pt-2" style={{justifyContent: "space-between"}}>
          <div className="flex flex-col w-2/5" style={{justifyContent: "space-between"}}>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>From </b>vitalik.eth</div>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>To </b>nick.eth</div>
          </div>
          <div className="flex flex-row w-1/5 align-center justify-center"
               style={{border:"1px solid rgba(50, 50, 50, .5)", borderRadius: "6px"}}>
            <div className="flex flex-col align-center justify-center">
              <img className="h-5" src="./usdc-logo.png" />
            </div>
            <div className="flex flex-col font-semibold align-center justify-center text-xs">&nbsp;50</div>
          </div>
          <div className="flex flex-col align-center justify-center text-lg">✅</div>
          <div className="flex flex-col w-1/10 font-medium align-center justify-center text-blue-600 text-xs underline-offset-4 hover:scale-105"
            style={{textDecoration: "underline"}}>
            Txn
          </div>
        </div>
      </div>

      {/* THIS IS ONE PIC */}
      
      <div className="border-solid border-2 border-neutral-600/20 bg-white p-4 rounded-md mb-10 shadow-md">
        <div className="flex flex-row" style = {{justifyContent: "space-between"}}>
          <div className="w-1/2 text-sm contents">1 hr yoga session 🧘🏼‍♂️</div>
          <div className="flex align-left space-x-2">
            <div className="text-slate-400 opacity-80">1d ago</div>
          </div>
        </div>
        <br></br>
        <img style={{margin:"0 -8px", maxWidth:"105%", borderRadius:"6px"}}  />
        <div className="flex flex-row text-xs pt-2" style={{justifyContent: "space-between"}}>
          <div className="flex flex-col w-2/5" style={{justifyContent: "space-between"}}>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>From </b>pransky.eth</div>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>To </b>justcommit.eth</div>
          </div>
          <div className="flex flex-row w-1/5 align-center justify-center"
               style={{border:"1px solid rgba(50, 50, 50, .5)", borderRadius: "6px"}}>
            <div className="flex flex-col align-center justify-center">
              <img className="h-5" src="./usdc-logo.png" />
            </div>
            <div className="flex flex-col font-semibold align-center justify-center text-xs">&nbsp;100</div>
          </div>
          <div className="flex flex-col align-center justify-center text-lg">❌</div>
          <div className="flex flex-col w-1/10 font-medium align-center justify-center text-blue-600 text-xs underline-offset-4 hover:scale-105"
            style={{textDecoration: "underline"}}>
            Txn
          </div>
        </div>
      </div>

      {/* THIS IS ONE PIC */}
      
      <div className="border-solid border-2 border-neutral-600/20 bg-white p-4 rounded-md mb-10 shadow-md">
        <div className="flex flex-row" style = {{justifyContent: "space-between"}}>
          <div className="w-1/2 text-sm contents">A meditation session today</div>
          <div className="flex align-left space-x-2">
            <div className="text-slate-400 opacity-80">2d ago</div>
          </div>
        </div>
        <br></br>
        <img style={{margin:"0 -8px", maxWidth:"105%", borderRadius:"6px"}} src="./dummy-pic-7.png" />
        <div className="flex flex-row text-xs pt-2" style={{justifyContent: "space-between"}}>
          <div className="flex flex-col w-2/5" style={{justifyContent: "space-between"}}>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>From </b>juan.eth</div>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>To </b>pedro.eth</div>
          </div>
          <div className="flex flex-row w-1/5 align-center justify-center"
               style={{border:"1px solid rgba(50, 50, 50, .5)", borderRadius: "6px"}}>
            <div className="flex flex-col align-center justify-center">
              <img className="h-5" src="./usdc-logo.png" />
            </div>
            <div className="flex flex-col font-semibold align-center justify-center text-xs">&nbsp;50</div>
          </div>
          <div className="flex flex-col align-center justify-center text-lg">✅</div>
          <div className="flex flex-col w-1/10 font-medium align-center justify-center text-blue-600 text-xs underline-offset-4 hover:scale-105"
            style={{textDecoration: "underline"}}>
            <a href="https://goerli.etherscan.io/tx/0x64390a056f3a6617040ff9f4273e6d233599edf54e52296ac5212449f480f74f">Txn</a>
          </div>
        </div>
      </div>

      {/* THIS IS ONE PIC */}
      
      <div className="border-solid border-2 border-neutral-600/20 bg-white p-4 rounded-md mb-10 shadow-md">
        <div className="flex flex-row" style = {{justifyContent: "space-between"}}>
          <div className="w-1/2 text-sm contents">Go for a run! 🏃🏼‍♂️</div>
          <div className="flex align-left space-x-2">
            <div className="text-slate-400 opacity-80">3d ago</div>
          </div>
        </div>
        <br></br>
        <img style={{margin:"0 -8px", maxWidth:"105%", borderRadius:"6px"}} src="./dummy-pic-8.png" />
        <div className="flex flex-row text-xs pt-2" style={{justifyContent: "space-between"}}>
          <div className="flex flex-col w-2/5" style={{justifyContent: "space-between"}}>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>From </b>josh.eth</div>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>To </b>john.eth</div>
          </div>
          <div className="flex flex-row w-1/5 align-center justify-center"
               style={{border:"1px solid rgba(50, 50, 50, .5)", borderRadius: "6px"}}>
            <div className="flex flex-col align-center justify-center">
              <img className="h-5" src="./usdc-logo.png" />
            </div>
            <div className="flex flex-col font-semibold align-center justify-center text-xs">&nbsp;100</div>
          </div>
          <div className="flex flex-col align-center justify-center text-lg">✅</div>
          <div className="flex flex-col w-1/10 font-medium align-center justify-center text-blue-600 text-xs underline-offset-4 hover:scale-105"
            style={{textDecoration: "underline"}}>
            <a href="https://goerli.etherscan.io/tx/0x64390a056f3a6617040ff9f4273e6d233599edf54e52296ac5212449f480f74f">Txn</a>
          </div>
        </div>
      </div>

      
      {/* THIS IS ONE PIC */}
      
      <div className="border-solid border-2 border-neutral-600/20 bg-white p-4 rounded-md mb-10 shadow-md">
        <div className="flex flex-row" style = {{justifyContent: "space-between"}}>
          <div className="w-1/2 text-sm contents">Go to the driving range 🏌🏼‍♂️</div>
          <div className="flex align-left space-x-2">
            <div className="text-slate-400 opacity-80">3d ago</div>
          </div>
        </div>
        <br></br>
        <img style={{margin:"0 -8px", maxWidth:"105%", borderRadius:"6px"}} src="./dummy-pic-6.png" />
        <div className="flex flex-row text-xs pt-2" style={{justifyContent: "space-between"}}>
          <div className="flex flex-col w-2/5" style={{justifyContent: "space-between"}}>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>From </b>friend-1.eth</div>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>To </b>friend-2.eth</div>
          </div>
          <div className="flex flex-row w-1/5 align-center justify-center"
               style={{border:"1px solid rgba(50, 50, 50, .5)", borderRadius: "6px"}}>
            <div className="flex flex-col align-center justify-center">
              <img className="h-5" src="./usdc-logo.png" />
            </div>
            <div className="flex flex-col font-semibold align-center justify-center text-xs">&nbsp;500</div>
          </div>
          <div className="flex flex-col align-center justify-center text-lg">✅</div>
          <div className="flex flex-col w-1/10 font-medium align-center justify-center text-blue-600 text-xs underline-offset-4 hover:scale-105"
            style={{textDecoration: "underline"}}>
            <a href="https://goerli.etherscan.io/tx/0x64390a056f3a6617040ff9f4273e6d233599edf54e52296ac5212449f480f74f">Txn</a>
          </div>
        </div>
      </div>

      {/* THIS IS ONE PIC */}
      
      <div className="border-solid border-2 border-neutral-600/20 bg-white p-4 rounded-md mb-10 shadow-md">
        <div className="flex flex-row" style = {{justifyContent: "space-between"}}>
          <div className="w-1/2 text-sm contents">Do push-ups!</div>
          <div className="flex align-left space-x-2">
            <div className="text-slate-400 opacity-80">32d ago</div>
          </div>
        </div>
        <br></br>
        <img style={{margin:"0 -8px", maxWidth:"105%", borderRadius:"6px"}} src="./dummy-pic-5.png" />
        <div className="flex flex-row text-xs pt-2" style={{justifyContent: "space-between"}}>
          <div className="flex flex-col w-2/5" style={{justifyContent: "space-between"}}>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>From </b>belf.eth</div>
            <div className="flex flex-row" style={{justifyContent: "space-between"}}><b>To </b>justcommit.eth</div>
          </div>
          <div className="flex flex-row w-1/5 align-center justify-center"
               style={{border:"1px solid rgba(50, 50, 50, .5)", borderRadius: "6px"}}>
            <div className="flex flex-col align-center justify-center">
              <img className="h-5" src="./usdc-logo.png" />
            </div>
            <div className="flex flex-col font-semibold align-center justify-center text-xs">&nbsp;20</div>
          </div>
          <div className="flex flex-col align-center justify-center text-lg">✅</div>
          <div className="flex flex-col w-1/10 font-medium align-center justify-center text-blue-600 text-xs underline-offset-4 hover:scale-105"
            style={{textDecoration: "underline"}}>
            <a href="https://goerli.etherscan.io/tx/0x64390a056f3a6617040ff9f4273e6d233599edf54e52296ac5212449f480f74f">Txn</a>
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
