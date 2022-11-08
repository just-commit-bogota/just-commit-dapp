import Header from "../components/Header.js"
import Commit from "../components/Commit.js"

export default function Feed() {
  return (
    <>
      <Header />
      <div className= "w-1/2 h-full mx-auto mt-24 p-8">
        <div className= "flex-col justify-center">
          <Commit />
          <Commit />
          <Commit />
        </div>
      </div>
    </>
  )
}

